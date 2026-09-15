export interface ZipSaveRequest {
  name: string
  body: ReadableStream<Uint8Array>
  shouldSave?: () => boolean
  expectedBytes?: number
  signal?: AbortSignal
}

export interface ZipSink {
  streaming: boolean
  browserCanStream: boolean
  save(args: ZipSaveRequest): Promise<void>
}

export interface ServiceWorkerSinkOptions {
  url: string
  keepaliveMs?: number
  firstByteMs?: number
  handoverMs?: number
  transferStreams?: boolean
  transferChunks?: boolean
  holdWorkerUntilComplete?: boolean
  completionMs?: number
  onEvent?: (event: ZipSinkEvent) => void
  connect?: () => Promise<ServiceWorker | null>
  probe?: (worker: ServiceWorker) => Promise<boolean>
  navigate?: (url: string) => () => void
}

export function workerUrlForBase(base: string): string {
  return `${base.endsWith('/') ? base : `${base}/`}zip-download-sw.js`
}

export const DEFAULT_ZIP_SERVICE_WORKER_URL = workerUrlForBase(import.meta.env.BASE_URL)

export interface ZipSinkEvent {
  type: string
  [key: string]: unknown
}

export const ZIP_SINK_PROTOCOL = 2
export const MAX_ZIP_CHUNK_BYTES = 256 * 1024

export function cancellationDetail(reason: unknown): string {
  if (reason instanceof Error) return `${reason.name}: ${reason.message}`.slice(0, 1024)
  return String(reason ?? 'No reason supplied').slice(0, 1024)
}

const KEEPALIVE_MS = 4_000
const CONTROL_TIMEOUT_MS = 10_000
const HANDOVER_TIMEOUT_MS = 10_000
const PING_TIMEOUT_MS = 5_000
const FIRST_BYTE_TIMEOUT_MS = 60_000

export function transferableStreamsSupported(): boolean {
  try {
    const channel = new MessageChannel()
    const stream = new ReadableStream()
    channel.port1.postMessage(stream, [stream as unknown as Transferable])
    channel.port1.close()
    channel.port2.close()
    return true
  } catch {
    return false
  }
}

export function browserCanStreamToDisk(): boolean {
  return 'serviceWorker' in navigator && window.isSecureContext
}

export function createBlobSink(): ZipSink {
  return {
    streaming: false,
    browserCanStream: browserCanStreamToDisk(),
    save: async ({ name, body, shouldSave }) => {
      const blob = await new Response(body).blob()
      if (shouldSave && !shouldSave()) return
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement('a')
      anchor.href = url
      anchor.download = name
      anchor.rel = 'noopener noreferrer'
      anchor.style.display = 'none'
      document.body.appendChild(anchor)
      anchor.click()
      document.body.removeChild(anchor)
      setTimeout(() => URL.revokeObjectURL(url), 4_000)
    }
  }
}

function scopeFor(options: ServiceWorkerSinkOptions): string {
  return new URL('./', new URL(options.url, window.location.href)).pathname
}

export interface PulledStream {
  readable: ReadableStream<Uint8Array>
  done: Promise<void>
  hasPulled: () => boolean
  bytesRead: () => number
  abandon: (reason: Error) => Promise<void>
}

export function pullDrivenStream(body: ReadableStream<Uint8Array>): PulledStream {
  const reader = body.getReader()
  let pulled = false
  let bytes = 0
  let settle: () => void = () => undefined
  let reject: (reason: Error) => void = () => undefined
  const done = new Promise<void>((resolve, fail) => {
    settle = resolve
    reject = fail
  })
  done.catch(() => undefined)
  const readable = new ReadableStream<Uint8Array>(
    {
      async pull(controller) {
        pulled = true
        try {
          const { value, done: finished } = await reader.read()
          if (finished) {
            controller.close()
            settle()
            return
          }
          bytes += value.byteLength
          controller.enqueue(value)
        } catch (error) {
          const failure = error instanceof Error ? error : new Error(String(error))
          controller.error(failure)
          reject(failure)
        }
      },
      cancel(reason) {
        void reader.cancel(reason).catch(() => undefined)
        reject(
          new Error('the browser stopped reading the download', {
            cause: cancellationDetail(reason)
          })
        )
      }
    },
    new CountQueuingStrategy({ highWaterMark: 0 })
  )
  return {
    readable,
    done,
    hasPulled: () => pulled,
    bytesRead: () => bytes,
    abandon: async (reason: Error) => {
      await reader.cancel(reason).catch(() => undefined)
      reject(reason)
    }
  }
}

export function withTimeout<T>(promise: Promise<T>, ms: number, fallback: T): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => resolve(fallback), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error: unknown) => {
        clearTimeout(timer)
        reject(error instanceof Error ? error : new Error(String(error)))
      }
    )
  })
}

export function transferableChunk(view: Uint8Array): ArrayBuffer {
  return view.slice().buffer
}

function pingWorker(worker: ServiceWorker): Promise<boolean> {
  const ack = new MessageChannel()
  const answered = new Promise<boolean>((resolve) => {
    ack.port1.onmessage = (event: MessageEvent) => {
      resolve((event.data as { type?: string } | null)?.type === 'zipdl-pong')
    }
  })
  worker.postMessage({ type: 'zipdl-ping', ack: ack.port2 }, [ack.port2])
  return withTimeout(answered, PING_TIMEOUT_MS, false).finally(() => ack.port1.close())
}

async function takeControl(options: ServiceWorkerSinkOptions): Promise<ServiceWorker | null> {
  const registration = await navigator.serviceWorker.register(options.url, {
    scope: scopeFor(options),
    updateViaCache: 'none'
  })
  const pending = registration.installing ?? registration.waiting
  if (!pending) return registration.active
  return new Promise<ServiceWorker | null>((resolve) => {
    pending.addEventListener('statechange', () => {
      if (pending.state === 'activated') resolve(registration.active)
      else if (pending.state === 'redundant') resolve(null)
    })
  })
}

function navigateHiddenFrame(url: string): () => void {
  const frame = document.createElement('iframe')
  frame.hidden = true
  frame.style.display = 'none'
  frame.src = url
  document.body.appendChild(frame)
  return () => frame.remove()
}

interface WorkerReply {
  type?: string
  id?: string
  protocol?: number
  bytes?: number
  reason?: string
}

function deferred<T>() {
  let resolve!: (value: T) => void
  let reject!: (error: Error) => void
  const promise = new Promise<T>((yes, no) => {
    resolve = yes
    reject = no
  })
  void promise.catch(() => undefined)
  return { promise, resolve, reject }
}

export async function createServiceWorkerSink(
  options: ServiceWorkerSinkOptions
): Promise<ZipSink | null> {
  if (!browserCanStreamToDisk()) return null
  let worker: ServiceWorker | null
  try {
    worker = await withTimeout(
      (options.connect ?? (() => takeControl(options)))(),
      CONTROL_TIMEOUT_MS,
      null
    )
    if (!worker || !(await (options.probe ?? pingWorker)(worker))) return null
  } catch {
    return null
  }
  const controller = worker
  return {
    streaming: true,
    browserCanStream: true,
    save: async ({ name, body, shouldSave, expectedBytes, signal }) => {
      if (signal?.aborted || (shouldSave && !shouldSave())) {
        await body.cancel(signal?.reason)
        return
      }
      if (
        expectedBytes !== undefined &&
        (!Number.isSafeInteger(expectedBytes) || expectedBytes < 0)
      ) {
        await body.cancel('Invalid ZIP length')
        throw new Error('The expected ZIP length must be a nonnegative safe integer.')
      }
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
      const pipe = pullDrivenStream(body)
      let sourceEnded = false
      const produced = pipe.done.then(() => {
        sourceEnded = true
      })
      void produced.catch(() => undefined)
      const registered = deferred<void>()
      const finished = deferred<number>()
      const started = deferred<void>()
      const disposers: Array<() => void> = []
      let success = false
      let failure = new Error('The ZIP download was interrupted.')
      const emit = (event: ZipSinkEvent) => {
        // Diagnostics must never change download behavior.
        try {
          options.onEvent?.(event)
        } catch {
          /* diagnostic consumer failed */
        }
      }
      const fail = (error: Error) => {
        registered.reject(error)
        finished.reject(error)
        started.reject(error)
      }
      const abort = () =>
        fail(
          new Error('The ZIP download was cancelled.', {
            cause: cancellationDetail(signal?.reason)
          })
        )
      signal?.addEventListener('abort', abort, { once: true })
      disposers.push(() => signal?.removeEventListener('abort', abort))
      try {
        const ack = new MessageChannel()
        disposers.push(() => {
          ack.port1.close()
          ack.port2.close()
        })
        ack.port1.onmessage = ({ data }: MessageEvent<WorkerReply>) => {
          if (data?.id !== id) return
          emit({ ...data, type: data.type ?? 'unknown-worker-message' })
          if (data.type === 'zipdl-registered') {
            if (data.protocol !== ZIP_SINK_PROTOCOL) {
              fail(new Error('The ZIP download worker is outdated. Reload the page and retry.'))
            } else registered.resolve()
          } else if (data.type === 'zipdl-started') started.resolve()
          else if (data.type === 'zipdl-closed') {
            if (!Number.isSafeInteger(data.bytes) || (data.bytes as number) < 0) {
              fail(new Error('The ZIP download worker returned an invalid byte count.'))
            } else finished.resolve(data.bytes as number)
          } else if (data.type === 'zipdl-error' || data.type === 'zipdl-cancelled') {
            fail(
              new Error(
                data.type === 'zipdl-cancelled'
                  ? 'the browser stopped reading the download'
                  : 'The ZIP download worker could not finish the stream.',
                { cause: data.reason }
              )
            )
          }
        }
        const transferStreams = options.transferStreams ?? transferableStreamsSupported()
        const message = {
          type: 'zipdl-register',
          protocol: ZIP_SINK_PROTOCOL,
          id,
          name,
          expectedBytes,
          holdUntilComplete: options.holdWorkerUntilComplete === true,
          ack: ack.port2
        }
        emit({
          type: 'sink-options',
          protocol: ZIP_SINK_PROTOCOL,
          transferStreams,
          transferChunks: options.transferChunks === true,
          maxChunkBytes: MAX_ZIP_CHUNK_BYTES,
          holdWorkerUntilComplete: options.holdWorkerUntilComplete === true,
          expectedBytes
        })
        if (transferStreams) {
          controller.postMessage({ ...message, stream: pipe.readable }, [
            pipe.readable as unknown as Transferable,
            ack.port2
          ])
        } else {
          const channel = new MessageChannel()
          const reader = pipe.readable.getReader()
          let pending: Uint8Array | undefined
          let offset = 0
          let reading = false
          let disposed = false
          disposers.push(() => {
            disposed = true
            channel.port1.close()
            channel.port2.close()
            pending = undefined
            if (!success) void reader.cancel(failure).catch(() => undefined)
          })
          channel.port1.onmessage = ({
            data
          }: MessageEvent<{ type?: string; reason?: string }>) => {
            if (data?.type === 'cancel') {
              const error = new Error('the browser stopped reading the download', {
                cause: data.reason
              })
              fail(error)
              void reader.cancel(error).catch(() => undefined)
              return
            }
            if (data?.type !== 'pull' || reading || disposed) return
            reading = true
            void (async () => {
              try {
                if (!pending) {
                  const next = await reader.read()
                  if (disposed) return
                  if (next.done) {
                    channel.port1.postMessage({ type: 'close' })
                    return
                  }
                  pending = next.value
                  offset = 0
                }
                const end = Math.min(offset + MAX_ZIP_CHUNK_BYTES, pending.byteLength)
                const chunk = transferableChunk(pending.subarray(offset, end))
                offset = end
                if (end === pending.byteLength) pending = undefined
                channel.port1.postMessage(
                  { type: 'chunk', chunk },
                  options.transferChunks ? [chunk] : []
                )
              } catch (reason) {
                const error = reason instanceof Error ? reason : new Error(String(reason))
                if (!disposed) channel.port1.postMessage({ type: 'error', message: error.message })
                fail(error)
              } finally {
                reading = false
              }
            })().catch((reason: unknown) => fail(new Error(cancellationDetail(reason))))
          }
          controller.postMessage({ ...message, port: channel.port2 }, [channel.port2, ack.port2])
        }
        const accepted = await withTimeout(
          registered.promise.then(() => true),
          options.handoverMs ?? HANDOVER_TIMEOUT_MS,
          false
        )
        if (!accepted) throw new Error('the download service worker did not accept the zip stream')
        signal?.throwIfAborted()
        const removeFrame = (options.navigate ?? navigateHiddenFrame)(
          `${scopeFor(options)}zipdl/${id}/${encodeURIComponent(name)}`
        )
        disposers.push(() => {
          if (success) setTimeout(removeFrame, 4000)
          else removeFrame()
        })
        const keepalive = setInterval(() => {
          try {
            controller.postMessage({ type: 'zipdl-keepalive', id })
          } catch (error) {
            fail(
              new Error('The ZIP download worker is unavailable.', {
                cause: cancellationDetail(error)
              })
            )
          }
        }, options.keepaliveMs ?? KEEPALIVE_MS)
        disposers.push(() => clearInterval(keepalive))
        const began = await withTimeout(
          started.promise.then(() => true),
          options.firstByteMs ?? FIRST_BYTE_TIMEOUT_MS,
          false
        )
        if (!began) throw new Error('the browser never started the download')
        const earlyFinish = finished.promise.then((bytes) => {
          if (!sourceEnded)
            throw new Error('The ZIP download worker closed before the producer finished.')
          if (bytes !== pipe.bytesRead())
            throw new Error('The ZIP download worker byte count does not match the producer.')
        })
        await Promise.race([produced, earlyFinish])
        const bytes = await withTimeout(finished.promise, options.completionMs ?? 30_000, null)
        if (bytes === null) throw new Error('The ZIP download worker did not confirm completion.')
        if (
          bytes !== pipe.bytesRead() ||
          (expectedBytes !== undefined && bytes !== expectedBytes)
        ) {
          throw new Error('The ZIP download length did not match the expected byte count.')
        }
        await pipe.done
        signal?.throwIfAborted()
        success = true
        emit({ type: 'sink-complete', bytes, verifiedOnDisk: false })
      } catch (reason) {
        failure = reason instanceof Error ? reason : new Error(String(reason))
        emit({
          type: 'sink-error',
          message: failure.message,
          reason: cancellationDetail(failure.cause ?? failure)
        })
        throw failure
      } finally {
        if (!success) {
          void pipe.abandon(failure).catch(() => undefined)
          try {
            controller.postMessage({
              type: 'zipdl-unregister',
              id,
              reason: cancellationDetail(failure)
            })
          } catch {
            /* worker already gone */
          }
        }
        for (const dispose of disposers.reverse()) {
          try {
            dispose()
          } catch {
            /* preserve the original result */
          }
        }
      }
    }
  }
}

export async function resolveZipSink(options?: { serviceWorkerUrl?: string }): Promise<ZipSink> {
  const streaming = await createServiceWorkerSink({
    url: options?.serviceWorkerUrl ?? DEFAULT_ZIP_SERVICE_WORKER_URL
  })
  return streaming ?? createBlobSink()
}
