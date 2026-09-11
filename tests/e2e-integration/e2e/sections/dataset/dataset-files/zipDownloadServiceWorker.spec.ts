const WORKER_URL = '/modern/zip-download-sw.js'
const SCOPE = '/modern/'

type Win = Cypress.AUTWindow

const streamOf = (win: Win, chunks: string[]) =>
  new win.ReadableStream<Uint8Array>({
    start(controller) {
      for (const chunk of chunks) controller.enqueue(new win.TextEncoder().encode(chunk))
      controller.close()
    }
  })

async function controllingWorker(win: Win): Promise<ServiceWorker> {
  await win.navigator.serviceWorker.register(WORKER_URL, { scope: SCOPE })
  await win.navigator.serviceWorker.ready
  if (win.navigator.serviceWorker.controller) return win.navigator.serviceWorker.controller
  return new Promise<ServiceWorker>((resolve) => {
    win.navigator.serviceWorker.addEventListener('controllerchange', function once() {
      win.navigator.serviceWorker.removeEventListener('controllerchange', once)
      resolve(win.navigator.serviceWorker.controller as ServiceWorker)
    })
  })
}

function registered(win: Win, id: string): Promise<void> {
  return new Promise((resolve) => {
    win.navigator.serviceWorker.addEventListener(
      'message',
      function onMessage(event: MessageEvent) {
        const data = event.data as { type?: string; id?: string } | null
        if (data?.type !== 'zipdl-registered' || data.id !== id) return
        win.navigator.serviceWorker.removeEventListener('message', onMessage)
        resolve()
      }
    )
  })
}

let counter = 0
const nextId = () => `e2e-${Date.now()}-${counter++}`

describe('zip download service worker', () => {
  beforeEach(() => {
    cy.visit(SCOPE)
  })

  it('takes control of the page and answers the capability ping', () => {
    cy.window({ timeout: 30000 }).then(async (win) => {
      const worker = await controllingWorker(win)
      expect(worker, 'the worker controls the page').to.not.equal(null)
      const response = await win.fetch(`${SCOPE}zipdl/ping`, { cache: 'no-store' })
      expect(response.ok).to.equal(true)
      expect(await response.text()).to.equal('ok')
    })
  })

  it('serves a transferred stream as a zip attachment with the exact bytes', () => {
    cy.window({ timeout: 30000 }).then(async (win) => {
      const worker = await controllingWorker(win)
      const id = nextId()
      const stream = streamOf(win, ['hello ', 'streamed ', 'zip'])
      const ack = registered(win, id)
      worker.postMessage({ type: 'zipdl-register', id, name: 'bundle.zip', stream }, [
        stream as unknown as Transferable
      ])
      await ack

      const response = await win.fetch(`${SCOPE}zipdl/${id}/bundle.zip`)
      expect(response.status).to.equal(200)
      expect(response.headers.get('content-type')).to.equal('application/zip')
      expect(response.headers.get('content-disposition')).to.contain('attachment')
      expect(response.headers.get('content-disposition')).to.contain('bundle.zip')
      expect(await response.text()).to.equal('hello streamed zip')
    })
  })

  it('serves a stream pumped over a MessageChannel, the path Safari has to use', () => {
    cy.window({ timeout: 30000 }).then(async (win) => {
      const worker = await controllingWorker(win)
      const id = nextId()
      const reader = streamOf(win, ['port ', 'pumped ', 'bytes']).getReader()
      const channel = new win.MessageChannel()
      channel.port1.onmessage = (event: MessageEvent) => {
        if ((event.data as { type?: string } | null)?.type !== 'pull') return
        void reader.read().then(({ value, done }) => {
          if (done || !value) {
            channel.port1.postMessage({ type: 'close' })
            return
          }
          const buffer = value.buffer as ArrayBuffer
          channel.port1.postMessage({ type: 'chunk', chunk: buffer }, [buffer])
        })
      }
      const ack = registered(win, id)
      worker.postMessage({ type: 'zipdl-register', id, name: 'ported.zip', port: channel.port2 }, [
        channel.port2
      ])
      await ack

      const response = await win.fetch(`${SCOPE}zipdl/${id}/ported.zip`)
      expect(await response.text()).to.equal('port pumped bytes')
    })
  })

  it('fails the download when the page errors the stream instead of truncating it', () => {
    cy.window({ timeout: 30000 }).then(async (win) => {
      const worker = await controllingWorker(win)
      const id = nextId()
      let sent = false
      const stream = new win.ReadableStream<Uint8Array>({
        pull(controller) {
          if (!sent) {
            sent = true
            controller.enqueue(new win.TextEncoder().encode('half'))
            return
          }
          controller.error(new Error('source died'))
        }
      })
      const ack = registered(win, id)
      worker.postMessage({ type: 'zipdl-register', id, name: 'broken.zip', stream }, [
        stream as unknown as Transferable
      ])
      await ack

      let failed = false
      try {
        const response = await win.fetch(`${SCOPE}zipdl/${id}/broken.zip`)
        await response.text()
      } catch {
        failed = true
      }
      expect(failed, 'reading the body rejected rather than returning a short file').to.equal(true)
    })
  })

  it('answers the keepalive ping while a download is registered', () => {
    cy.window({ timeout: 30000 }).then(async (win) => {
      const worker = await controllingWorker(win)
      const id = nextId()
      const stream = streamOf(win, ['kept alive'])
      const ack = registered(win, id)
      worker.postMessage({ type: 'zipdl-register', id, name: 'alive.zip', stream }, [
        stream as unknown as Transferable
      ])
      await ack
      const response = await win.fetch(`${SCOPE}zipdl/${id}/keepalive`, { cache: 'no-store' })
      expect(response.ok).to.equal(true)
    })
  })

  it('404s an unknown download and hands a registered one out only once', () => {
    cy.window({ timeout: 30000 }).then(async (win) => {
      const worker = await controllingWorker(win)
      expect((await win.fetch(`${SCOPE}zipdl/never-registered/x.zip`)).status).to.equal(404)

      const id = nextId()
      const stream = streamOf(win, ['once'])
      const ack = registered(win, id)
      worker.postMessage({ type: 'zipdl-register', id, name: 'once.zip', stream }, [
        stream as unknown as Transferable
      ])
      await ack
      expect((await win.fetch(`${SCOPE}zipdl/${id}/once.zip`)).status).to.equal(200)
      expect((await win.fetch(`${SCOPE}zipdl/${id}/once.zip`)).status).to.equal(404)
    })
  })

  it('encodes a non-ascii file name for both old and new clients', () => {
    cy.window({ timeout: 30000 }).then(async (win) => {
      const worker = await controllingWorker(win)
      const id = nextId()
      const stream = streamOf(win, ['x'])
      const ack = registered(win, id)
      worker.postMessage({ type: 'zipdl-register', id, name: 'näme ünicode.zip', stream }, [
        stream as unknown as Transferable
      ])
      await ack
      const response = await win.fetch(
        `${SCOPE}zipdl/${id}/${encodeURIComponent('näme ünicode.zip')}`
      )
      const disposition = response.headers.get('content-disposition') ?? ''
      expect(disposition).to.contain("filename*=UTF-8''")
      expect(disposition).to.contain('filename="')
    })
  })
})
