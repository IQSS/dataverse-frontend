export interface ZipSaveRequest {
  name: string
  body: ReadableStream<Uint8Array>
  shouldSave?: () => boolean
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
  connect?: () => Promise<ServiceWorker | null>
  probe?: (worker: ServiceWorker) => Promise<boolean>
  navigate?: (url: string) => () => void
}

export function workerUrlForBase(base: string): string {
  return `${base.endsWith('/') ? base : `${base}/`}zip-download-sw.js`
}

export const DEFAULT_ZIP_SERVICE_WORKER_URL = workerUrlForBase(import.meta.env.BASE_URL)

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
  abandon: (reason: Error) => Promise<void>
}

export function pullDrivenStream(body: ReadableStream<Uint8Array>): PulledStream {
  const reader = body.getReader()
  let pulled = false
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
          controller.enqueue(value)
        } catch (error) {
          const failure = error instanceof Error ? error : new Error(String(error))
          controller.error(failure)
          reject(failure)
        }
      },
      cancel(reason) {
        void reader.cancel(reason).catch(() => undefined)
        reject(new Error('the browser stopped reading the download'))
      }
    },
    new CountQueuingStrategy({ highWaterMark: 0 })
  )
  return {
    readable,
    done,
    hasPulled: () => pulled,
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
    scope: scopeFor(options)
  })
  if (registration.active) return registration.active
  const pending = registration.installing ?? registration.waiting
  if (!pending) return null
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

function handOver(
  controller: ServiceWorker,
  id: string,
  name: string,
  readable: ReadableStream<Uint8Array>,
  signal: AbortSignal,
  transferStreams: boolean
): Promise<void> {
  return new Promise<void>((resolve) => {
    const ack = new MessageChannel()
    ack.port1.onmessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; id?: string } | null
      if (data?.type !== 'zipdl-registered' || data.id !== id) return
      ack.port1.close()
      resolve()
    }
    signal.addEventListener('abort', () => {
      ack.port1.close()
    })
    if (transferStreams) {
      controller.postMessage(
        { type: 'zipdl-register', id, name, stream: readable, ack: ack.port2 },
        [readable as unknown as Transferable, ack.port2]
      )
      return
    }
    const channel = new MessageChannel()
    const reader = readable.getReader()
    signal.addEventListener('abort', () => {
      channel.port1.close()
    })
    channel.port1.onmessage = (event: MessageEvent) => {
      const type = (event.data as { type?: string } | null)?.type
      if (type === 'cancel') {
        void reader.cancel('cancelled by the download').catch(() => undefined)
        return
      }
      reader.read().then(
        ({ value, done }) => {
          if (done || !value) {
            channel.port1.postMessage({ type: 'close' })
            return
          }
          const buffer = transferableChunk(value)
          channel.port1.postMessage({ type: 'chunk', chunk: buffer }, [buffer])
        },
        (error: unknown) => {
          channel.port1.postMessage({
            type: 'error',
            message: error instanceof Error ? error.message : String(error)
          })
        }
      )
    }
    controller.postMessage(
      { type: 'zipdl-register', id, name, port: channel.port2, ack: ack.port2 },
      [channel.port2, ack.port2]
    )
  })
}

export async function createServiceWorkerSink(
  options: ServiceWorkerSinkOptions
): Promise<ZipSink | null> {
  if (!browserCanStreamToDisk()) return null
  const scope = scopeFor(options)
  const connect = options.connect ?? (() => takeControl(options))
  const probe = options.probe ?? pingWorker
  const navigate = options.navigate ?? navigateHiddenFrame
  let controller: ServiceWorker | null = null
  try {
    controller = await withTimeout(connect(), CONTROL_TIMEOUT_MS, null)
    if (!controller) return null
    if (!(await probe(controller))) return null
  } catch {
    return null
  }
  const worker = controller
  return {
    streaming: true,
    browserCanStream: true,
    save: async ({ name, body, shouldSave }) => {
      if (shouldSave && !shouldSave()) {
        await body.cancel()
        return
      }
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
      const cleanup = new AbortController()
      const pipe = pullDrivenStream(body)
      const done = pipe.done
      const abandon = async (reason: Error) => {
        worker.postMessage({ type: 'zipdl-unregister', id })
        cleanup.abort()
        await pipe.abandon(reason)
        throw reason
      }
      const handedOver = await withTimeout(
        handOver(
          worker,
          id,
          name,
          pipe.readable,
          cleanup.signal,
          options.transferStreams ?? transferableStreamsSupported()
        ).then(() => true),
        options.handoverMs ?? HANDOVER_TIMEOUT_MS,
        false
      )
      if (!handedOver) {
        await abandon(new Error('the download service worker did not accept the zip stream'))
      }
      const removeFrame = navigate(`${scope}zipdl/${id}/${encodeURIComponent(name)}`)
      const keepalive = setInterval(() => {
        worker.postMessage({ type: 'zipdl-keepalive', id })
      }, options.keepaliveMs ?? KEEPALIVE_MS)
      const started = new Promise<'never read'>((resolve) => {
        setTimeout(() => {
          if (!pipe.hasPulled()) resolve('never read')
        }, options.firstByteMs ?? FIRST_BYTE_TIMEOUT_MS)
      })
      try {
        const outcome = await Promise.race([done.then(() => 'done' as const), started])
        if (outcome === 'never read') {
          await abandon(new Error('the browser never started the download'))
        }
        await done
      } finally {
        clearInterval(keepalive)
        setTimeout(removeFrame, 4_000)
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
