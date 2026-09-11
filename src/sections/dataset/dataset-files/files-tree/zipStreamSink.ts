export interface ZipSaveRequest {
  name: string
  body: ReadableStream<Uint8Array>
  shouldSave?: () => boolean
}

export interface ZipSink {
  streaming: boolean
  save(args: ZipSaveRequest): Promise<void>
}

export interface ServiceWorkerSinkOptions {
  url: string
  scope?: string
  keepaliveMs?: number
}

export const DEFAULT_ZIP_SERVICE_WORKER_URL = '/zip-download-sw.js'

const KEEPALIVE_MS = 4_000
const CONTROL_TIMEOUT_MS = 10_000

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

export function createBlobSink(): ZipSink {
  return {
    streaming: false,
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
  if (options.scope) return options.scope.endsWith('/') ? options.scope : `${options.scope}/`
  return new URL('./', new URL(options.url, window.location.href)).pathname
}

async function takeControl(options: ServiceWorkerSinkOptions): Promise<ServiceWorker | null> {
  const scope = scopeFor(options)
  await navigator.serviceWorker.register(options.url, { scope })
  await navigator.serviceWorker.ready
  if (navigator.serviceWorker.controller) return navigator.serviceWorker.controller
  return new Promise<ServiceWorker | null>((resolve) => {
    const timer = setTimeout(() => {
      navigator.serviceWorker.removeEventListener('controllerchange', onChange)
      resolve(null)
    }, CONTROL_TIMEOUT_MS)
    const onChange = () => {
      clearTimeout(timer)
      navigator.serviceWorker.removeEventListener('controllerchange', onChange)
      resolve(navigator.serviceWorker.controller)
    }
    navigator.serviceWorker.addEventListener('controllerchange', onChange)
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
  readable: ReadableStream<Uint8Array>
): Promise<void> {
  return new Promise<void>((resolve) => {
    const onMessage = (event: MessageEvent) => {
      const data = event.data as { type?: string; id?: string } | null
      if (data?.type !== 'zipdl-registered' || data.id !== id) return
      navigator.serviceWorker.removeEventListener('message', onMessage)
      resolve()
    }
    navigator.serviceWorker.addEventListener('message', onMessage)
    if (transferableStreamsSupported()) {
      controller.postMessage({ type: 'zipdl-register', id, name, stream: readable }, [
        readable as unknown as Transferable
      ])
      return
    }
    const channel = new MessageChannel()
    const reader = readable.getReader()
    channel.port1.onmessage = (event: MessageEvent) => {
      const type = (event.data as { type?: string } | null)?.type
      if (type === 'cancel') {
        void reader.cancel('cancelled by the download')
        return
      }
      reader.read().then(
        ({ value, done }) => {
          if (done || !value) {
            channel.port1.postMessage({ type: 'close' })
            return
          }
          const buffer = value.buffer as ArrayBuffer
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
    controller.postMessage({ type: 'zipdl-register', id, name, port: channel.port2 }, [
      channel.port2
    ])
  })
}

export async function createServiceWorkerSink(
  options: ServiceWorkerSinkOptions
): Promise<ZipSink | null> {
  if (!('serviceWorker' in navigator) || !window.isSecureContext) return null
  const scope = scopeFor(options)
  let controller: ServiceWorker | null = null
  try {
    controller = await takeControl(options)
    if (!controller) return null
    const probe = await fetch(`${scope}zipdl/ping`, { cache: 'no-store' })
    if (!probe.ok) return null
  } catch {
    return null
  }
  const worker = controller
  return {
    streaming: true,
    save: async ({ name, body, shouldSave }) => {
      if (shouldSave && !shouldSave()) {
        await body.cancel()
        return
      }
      const id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
      const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>()
      const done = body.pipeTo(writable)
      await handOver(worker, id, name, readable)
      const removeFrame = navigateHiddenFrame(`${scope}zipdl/${id}/${encodeURIComponent(name)}`)
      const keepalive = setInterval(() => {
        void fetch(`${scope}zipdl/${id}/keepalive`, { cache: 'no-store' }).catch(() => undefined)
      }, options.keepaliveMs ?? KEEPALIVE_MS)
      try {
        await done
      } finally {
        clearInterval(keepalive)
        setTimeout(removeFrame, 4_000)
      }
    }
  }
}

export async function resolveZipSink(options?: {
  serviceWorkerUrl?: string
  serviceWorkerScope?: string
}): Promise<ZipSink> {
  const streaming = await createServiceWorkerSink({
    url: options?.serviceWorkerUrl ?? DEFAULT_ZIP_SERVICE_WORKER_URL,
    scope: options?.serviceWorkerScope
  })
  return streaming ?? createBlobSink()
}
