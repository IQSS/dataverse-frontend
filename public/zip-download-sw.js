// Answers a same-origin download URL with a stream the page hands over, so a
// multi-gigabyte zip reaches disk without ever being held in tab memory.
// All fetching, retrying and zipping stays in the page; this only pipes bytes.

const PATH = '/zipdl/'
const streams = new Map()

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'zipdl-register') {
    streams.set(data.id, { name: data.name, stream: data.stream || null, port: data.port || null })
    const reply = { type: 'zipdl-registered', id: data.id }
    if (event.ports && event.ports[0] && !data.port) event.ports[0].postMessage(reply)
    else if (event.source) event.source.postMessage(reply)
  } else if (data.type === 'zipdl-unregister') {
    streams.delete(data.id)
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
  const ascii = name.replace(/[^\x20-\x7e]/g, '_').replace(/["\\]/g, '_')
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(name)}`
}

self.addEventListener('fetch', (event) => {
  const marker = new URL(event.request.url).pathname.indexOf(PATH)
  if (marker === -1) return
  const rest = new URL(event.request.url).pathname.slice(marker + PATH.length).split('/')
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
