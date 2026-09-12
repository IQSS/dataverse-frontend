const PATH = 'zipdl/'
const streams = new Map()
const SCOPE = new URL('./', self.registration ? self.registration.scope : self.location.href)
  .pathname

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'zipdl-register') {
    streams.set(data.id, { name: data.name, stream: data.stream || null, port: data.port || null })
    const reply = { type: 'zipdl-registered', id: data.id }
    if (data.ack) data.ack.postMessage(reply)
    else if (event.source) event.source.postMessage(reply)
  } else if (data.type === 'zipdl-unregister') {
    streams.delete(data.id)
  } else if (data.type === 'zipdl-ping') {
    if (data.ack) data.ack.postMessage({ type: 'zipdl-pong' })
    else if (event.source) event.source.postMessage({ type: 'zipdl-pong' })
  }
})

function streamFromPort(port) {
  let pending = null
  port.onmessage = (event) => {
    if (!pending) return
    const resolve = pending
    pending = null
    resolve(event.data || {})
  }
  const request = () =>
    new Promise((resolve) => {
      pending = resolve
      port.postMessage({ type: 'pull' })
    })
  return new ReadableStream({
    async pull(controller) {
      const msg = await request()
      if (msg.type === 'chunk') {
        controller.enqueue(new Uint8Array(msg.chunk))
      } else if (msg.type === 'close') {
        controller.close()
        port.close()
      } else {
        controller.error(new Error(msg.message || 'zip stream errored'))
        port.close()
      }
    },
    cancel() {
      port.postMessage({ type: 'cancel' })
      port.close()
    }
  })
}

function contentDisposition(name) {
  const ascii = String(name)
    .replace(/[^\x20-\x7e]/g, '_')
    .replace(/["\\]/g, '_')
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin) return
  const prefix = SCOPE + PATH
  if (!url.pathname.startsWith(prefix)) return
  const rest = url.pathname.slice(prefix.length).split('/')
  const id = rest[0]
  if (id === 'ping' || rest[1] === 'keepalive') {
    event.respondWith(new Response('ok', { headers: { 'Cache-Control': 'no-store' } }))
    return
  }
  const entry = streams.get(id)
  if (!entry) {
    event.respondWith(new Response('unknown download', { status: 404 }))
    return
  }
  streams.delete(id)
  event.respondWith(
    new Response(entry.stream || streamFromPort(entry.port), {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': contentDisposition(entry.name),
        'Cache-Control': 'no-store',
        'X-Content-Type-Options': 'nosniff'
      }
    })
  )
})
