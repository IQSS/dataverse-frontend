const PATH = 'zipdl/'
const PROTOCOL = 2
const MAX_CHUNK_BYTES = 256 * 1024
const streams = new Map()
const active = new Map()
const SCOPE = new URL('./', self.registration ? self.registration.scope : self.location.href)
  .pathname

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

function detail(reason) {
  return String(reason?.message ?? reason ?? 'No reason supplied').slice(0, 1024)
}

function reply(entry, type, fields = {}) {
  entry.ack?.postMessage({ type, protocol: PROTOCOL, id: entry.id, ...fields })
}

self.addEventListener('message', (event) => {
  const data = event.data || {}
  if (data.type === 'zipdl-register') {
    const entry = { ...data }
    streams.set(data.id, entry)
    if (data.ack) reply(entry, 'zipdl-registered')
    else event.source?.postMessage({ type: 'zipdl-registered', id: data.id, protocol: PROTOCOL })
  } else if (data.type === 'zipdl-unregister') {
    const entry = streams.get(data.id)
    streams.delete(data.id)
    if (entry) {
      void entry.stream?.cancel(data.reason).catch(() => undefined)
      entry.port?.postMessage({ type: 'cancel', reason: data.reason })
      entry.port?.close()
      entry.ack?.close()
    }
    active.get(data.id)?.(data.reason)
  } else if (data.type === 'zipdl-ping') {
    const response = { type: 'zipdl-pong', protocol: PROTOCOL }
    if (data.ack) data.ack.postMessage(response)
    else event.source?.postMessage(response)
  }
  // Receipt of keepalive messages keeps the worker active without holding a fetch event open.
})

function streamFromPort(port) {
  let pending = null
  port.onmessage = (event) => {
    if (!pending) return
    const resolve = pending
    pending = null
    resolve(event.data || {})
  }
  return new ReadableStream(
    {
      async pull(controller) {
        const msg = await new Promise((resolve) => {
          pending = resolve
          port.postMessage({ type: 'pull' })
        })
        if (msg.type === 'chunk') controller.enqueue(new Uint8Array(msg.chunk))
        else if (msg.type === 'close') {
          controller.close()
          port.close()
        } else {
          controller.error(new Error(msg.message || 'zip stream errored'))
          port.close()
        }
      },
      cancel(reason) {
        port.postMessage({ type: 'cancel', reason: detail(reason) })
        pending?.({ type: 'error', message: detail(reason) })
        pending = null
        port.close()
      }
    },
    { highWaterMark: 0 }
  )
}

function contentDisposition(name) {
  const ascii = String(name)
    .replace(/[^\x20-\x7e]/g, '_')
    .replace(/["\\]/g, '_')
  const encoded = encodeURIComponent(name).replace(
    /['()*]/g,
    (character) => `%${character.charCodeAt(0).toString(16).toUpperCase()}`
  )
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`
}

function trackedResponse(entry, event) {
  const reader = (entry.stream || streamFromPort(entry.port)).getReader()
  let bytes = 0
  let offset = 0
  let pending
  let terminal = false
  let first = true
  let progressAt = Date.now()
  let resolveFinished
  const finished = new Promise((resolve) => {
    resolveFinished = resolve
  })
  const finish = (type, reason) => {
    if (terminal) return
    terminal = true
    reply(entry, type, { bytes, ...(reason === undefined ? {} : { reason: detail(reason) }) })
    active.delete(entry.id)
    entry.ack?.close()
    resolveFinished()
  }
  const body = new ReadableStream(
    {
      start(controller) {
        active.set(entry.id, (reason) => {
          if (terminal) return
          controller.error(new Error(detail(reason)))
          finish('zipdl-cancelled', reason)
          void reader.cancel(reason).catch(() => undefined)
        })
      },
      async pull(controller) {
        if (first) {
          first = false
          reply(entry, 'zipdl-started')
        }
        try {
          if (!pending) {
            const next = await reader.read()
            if (terminal) return
            if (next.done) {
              if (entry.expectedBytes !== undefined && bytes !== entry.expectedBytes) {
                throw new Error('The ZIP stream ended before its declared length.')
              }
              controller.close()
              finish('zipdl-closed')
              return
            }
            pending = next.value
            offset = 0
          }
          const end = Math.min(offset + MAX_CHUNK_BYTES, pending.byteLength)
          const chunk = pending.slice(offset, end)
          offset = end
          if (end === pending.byteLength) pending = undefined
          if (
            entry.expectedBytes !== undefined &&
            bytes + Number(chunk.byteLength) > entry.expectedBytes
          ) {
            throw new Error('The ZIP stream exceeded its declared length.')
          }
          controller.enqueue(chunk)
          bytes += chunk.byteLength
          if (Date.now() - progressAt >= 1000) {
            reply(entry, 'zipdl-progress', { bytes })
            progressAt = Date.now()
          }
        } catch (error) {
          if (terminal) return
          controller.error(error)
          finish('zipdl-error', error)
          void reader.cancel(error).catch(() => undefined)
        }
      },
      cancel(reason) {
        finish('zipdl-cancelled', reason)
        void reader.cancel(reason).catch(() => undefined)
      }
    },
    { highWaterMark: 0 }
  )
  // Opt-in experiment only. Do not impose a long-running fetch-event lifetime on every browser.
  if (entry.holdUntilComplete === true) event.waitUntil(finished)
  return body
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (url.origin !== self.location.origin || !url.pathname.startsWith(SCOPE + PATH)) return
  const [id, name] = url.pathname.slice((SCOPE + PATH).length).split('/')
  if (id === 'ping' || name === 'keepalive') {
    event.respondWith(new Response('ok', { headers: { 'Cache-Control': 'no-store' } }))
    return
  }
  const entry = streams.get(id)
  if (!entry) {
    event.respondWith(new Response('unknown download', { status: 404 }))
    return
  }
  streams.delete(id)
  const headers = {
    'Content-Type': 'application/zip',
    'Content-Disposition': contentDisposition(entry.name),
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff'
  }
  if (entry.protocol === PROTOCOL && entry.expectedBytes !== undefined) {
    if (!Number.isSafeInteger(entry.expectedBytes) || entry.expectedBytes < 0) {
      reply(entry, 'zipdl-error', { reason: 'Invalid ZIP length' })
      event.respondWith(new Response('invalid download length', { status: 400 }))
      return
    }
    headers['Content-Length'] = String(entry.expectedBytes)
  }
  // Old pages remain supported during service-worker updates, but new pages require protocol 2.
  const body =
    entry.protocol === PROTOCOL
      ? trackedResponse(entry, event)
      : entry.stream || streamFromPort(entry.port)
  event.respondWith(new Response(body, { headers }))
})
