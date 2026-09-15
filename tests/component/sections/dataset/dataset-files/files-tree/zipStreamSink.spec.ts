import {
  createBlobSink,
  createServiceWorkerSink,
  pullDrivenStream,
  resolveZipSink,
  transferableChunk,
  withTimeout,
  workerUrlForBase
} from '../../../../../../src/sections/dataset/dataset-files/files-tree/zipStreamSink'

const streamOf = (text: string) =>
  new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(text))
      controller.close()
    }
  })

describe('resolveZipSink', () => {
  it('falls back to the buffered sink when the service worker cannot be registered', () => {
    cy.then(async () => {
      const sink = await resolveZipSink({ serviceWorkerUrl: '/no-such-worker-here.js' })
      expect(sink.streaming).to.equal(false)
    })
  })
})

describe('createBlobSink', () => {
  it('discards a completed blob when the caller has abandoned the download', () => {
    cy.window().then((win) => {
      cy.stub(win.URL, 'createObjectURL').as('createObjectURL')
      cy.stub(win.HTMLAnchorElement.prototype, 'click').as('anchorClick')
    })
    cy.then(async () => {
      await createBlobSink().save({
        name: 'abandoned.zip',
        body: streamOf('zip bytes'),
        shouldSave: () => false
      })
    })
    cy.get('@createObjectURL').should('not.have.been.called')
    cy.get('@anchorClick').should('not.have.been.called')
  })

  it('saves the stream through a download anchor', () => {
    cy.window().then((win) => {
      cy.stub(win.HTMLAnchorElement.prototype, 'click')
        .as('anchorClick')
        .callsFake(() => undefined)
    })
    cy.then(async () => {
      const sink = createBlobSink()
      await sink.save({ name: 'bundle.zip', body: streamOf('zip bytes') })
    })
    cy.get('@anchorClick').should('have.been.calledOnce')
  })

  it('names the saved file and cleans the anchor up', () => {
    const names: string[] = []
    cy.window().then((win) => {
      cy.stub(win.HTMLAnchorElement.prototype, 'click').callsFake(function (
        this: HTMLAnchorElement
      ) {
        names.push(this.download)
      })
    })
    cy.then(async () => {
      const sink = createBlobSink()
      await sink.save({ name: 'tree.zip', body: streamOf('bytes') })
    })
    cy.then(() => {
      expect(names).to.deep.equal(['tree.zip'])
      expect(document.querySelectorAll('a[download]').length).to.equal(0)
    })
  })
})

describe('workerUrlForBase', () => {
  it('adds the separator when the build base has no trailing slash', () => {
    expect(workerUrlForBase('/modern')).to.equal('/modern/zip-download-sw.js')
  })

  it('does not double the separator when the base already ends in one', () => {
    expect(workerUrlForBase('/modern/')).to.equal('/modern/zip-download-sw.js')
  })

  it('handles the site root', () => {
    expect(workerUrlForBase('/')).to.equal('/zip-download-sw.js')
  })

  it('handles a renamed base', () => {
    expect(workerUrlForBase('/spa')).to.equal('/spa/zip-download-sw.js')
  })
})

describe('transferableChunk', () => {
  it('never hands over the caller buffer, which the zip writer still reads from', () => {
    const chunk = new Uint8Array([1, 2, 3, 4])
    const out = transferableChunk(chunk)
    expect(out).to.not.equal(chunk.buffer)
    expect(Array.from(new Uint8Array(out))).to.deep.equal([1, 2, 3, 4])
    structuredClone(out, { transfer: [out] })
    expect(chunk.length, 'the original survives the transfer').to.equal(4)
  })

  it('sends only the view when the chunk is a window onto a larger buffer', () => {
    const backing = new Uint8Array([9, 9, 1, 2, 3, 9, 9])
    const view = backing.subarray(2, 5)
    const out = transferableChunk(view)
    expect(Array.from(new Uint8Array(out))).to.deep.equal([1, 2, 3])
  })

  it('sends only the view when the chunk stops short of the buffer end', () => {
    const backing = new Uint8Array([1, 2, 3, 7, 7, 7])
    const view = backing.subarray(0, 3)
    const out = transferableChunk(view)
    expect(new Uint8Array(out).byteLength).to.equal(3)
    expect(Array.from(new Uint8Array(out))).to.deep.equal([1, 2, 3])
  })
})

describe('withTimeout', () => {
  it('passes a value through when it settles in time', () => {
    cy.then(async () => {
      expect(await withTimeout(Promise.resolve('done'), 1000, 'late')).to.equal('done')
    })
  })

  it('gives up with the fallback instead of hanging', () => {
    cy.then(async () => {
      const started = performance.now()
      const result = await withTimeout(new Promise(() => undefined), 50, 'late')
      expect(result).to.equal('late')
      expect(performance.now() - started).to.be.lessThan(2000)
    })
  })

  it('does not swallow a rejection', () => {
    cy.then(async () => {
      let caught: unknown = null
      await withTimeout(Promise.reject(new Error('boom')), 1000, 'late').catch((e) => {
        caught = e
      })
      expect((caught as Error)?.message).to.equal('boom')
    })
  })

  it('preserves the reason when a promise rejects with a plain value', () => {
    cy.then(async () => {
      const failure = await withTimeout(Promise.reject('worker unavailable'), 1000, 'late').catch(
        (error: unknown) => error
      )
      expect(failure).to.be.instanceOf(Error)
      expect((failure as Error).message).to.equal('worker unavailable')
    })
  })
})

describe('pullDrivenStream', () => {
  const source = (chunks: string[]) =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(new TextEncoder().encode(chunk))
        controller.close()
      }
    })

  it('does not touch the source until the consumer reads', () => {
    cy.then(async () => {
      let started = false
      const body = new ReadableStream<Uint8Array>({
        pull(controller) {
          started = true
          controller.close()
        }
      })
      const wrapped = pullDrivenStream(body)
      expect(wrapped.hasPulled()).to.equal(false)
      expect(started).to.equal(false)
      await wrapped.readable.getReader().read()
      expect(wrapped.hasPulled()).to.equal(true)
    })
  })

  it('forwards every chunk and settles when the source ends', () => {
    cy.then(async () => {
      const wrapped = pullDrivenStream(source(['a', 'b', 'c']))
      const text = await new Response(wrapped.readable).text()
      expect(text).to.equal('abc')
      await wrapped.done
    })
  })

  for (const error of [new Error('source died'), 'source died']) {
    it(`rejects when the source throws ${typeof error} instead of ending quietly`, () => {
      cy.then(async () => {
        let sent = false
        const body = new ReadableStream<Uint8Array>({
          pull(controller) {
            if (!sent) {
              sent = true
              controller.enqueue(new TextEncoder().encode('half'))
              return
            }
            controller.error(error)
          }
        })
        const wrapped = pullDrivenStream(body)
        let message = ''
        wrapped.done.catch((error: Error) => {
          message = error.message
        })
        await new Response(wrapped.readable).text().catch(() => undefined)
        await new Promise((resolve) => setTimeout(resolve, 10))
        expect(message).to.equal('source died')
      })
    })
  }

  it('cancels the source and rejects when the consumer walks away', () => {
    cy.then(async () => {
      let cancelled = false
      const body = new ReadableStream<Uint8Array>({
        pull(controller) {
          controller.enqueue(new TextEncoder().encode('x'))
        },
        cancel() {
          cancelled = true
        }
      })
      const wrapped = pullDrivenStream(body)
      let rejected = false
      wrapped.done.catch(() => {
        rejected = true
      })
      const consumer = wrapped.readable.getReader()
      await consumer.read()
      await consumer.cancel('done with it')
      await new Promise((resolve) => setTimeout(resolve, 10))
      expect(cancelled, 'the source was cancelled').to.equal(true)
      expect(rejected, 'the run was reported as failed').to.equal(true)
    })
  })

  it('reports browser cancellation even when source cancellation rejects', () => {
    cy.then(async () => {
      const unhandled: unknown[] = []
      const onRejection = (event: PromiseRejectionEvent) => unhandled.push(event.reason)
      window.addEventListener('unhandledrejection', onRejection)
      try {
        let cancellationReason: unknown
        const body = new ReadableStream<Uint8Array>({
          cancel(reason) {
            cancellationReason = reason
            return Promise.reject(new Error('source cancellation failed'))
          }
        })
        const wrapped = pullDrivenStream(body)
        const outcome = wrapped.done.catch((error: Error) => error.message)
        await wrapped.readable.cancel('browser cancelled')
        expect(await outcome).to.equal('the browser stopped reading the download')
        expect(cancellationReason).to.equal('browser cancelled')
        await new Promise((resolve) => setTimeout(resolve, 20))
        expect(unhandled, 'source cancellation rejection was handled').to.deep.equal([])
      } finally {
        window.removeEventListener('unhandledrejection', onRejection)
      }
    })
  })
})

describe('createServiceWorkerSink', () => {
  interface Sent {
    type?: string
    id?: string
    name?: string
    stream?: ReadableStream<Uint8Array>
    port?: MessagePort
    ack?: MessagePort
  }

  const fakeWorker = (onMessage: (message: Sent) => void) =>
    ({
      postMessage: (message: Sent) => {
        onMessage(message)
      }
    } as unknown as ServiceWorker)

  const streamOf = (chunks: string[]) =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        for (const chunk of chunks) controller.enqueue(new TextEncoder().encode(chunk))
        controller.close()
      }
    })

  const build = (overrides: Partial<Parameters<typeof createServiceWorkerSink>[0]> = {}) => {
    const sent: Sent[] = []
    const navigated: string[] = []
    const worker = fakeWorker((message) => {
      sent.push(message)
      message.ack?.postMessage({ type: 'zipdl-registered', id: message.id, protocol: 2 })
    })
    return {
      sent,
      navigated,
      options: {
        url: '/zip-download-sw.js',
        keepaliveMs: 20,
        firstByteMs: 200,
        connect: () => Promise.resolve(worker),
        probe: () => Promise.resolve(true),
        navigate: (url: string) => {
          navigated.push(url)
          return () => undefined
        },
        ...overrides
      }
    }
  }

  it('reports itself unavailable when the worker never answers the ping', () => {
    cy.then(async () => {
      const { options } = build({ probe: () => Promise.resolve(false) })
      expect(await createServiceWorkerSink(options)).to.equal(null)
    })
  })

  it('reports itself unavailable when no worker takes control', () => {
    cy.then(async () => {
      const { options } = build({ connect: () => Promise.resolve(null) })
      expect(await createServiceWorkerSink(options)).to.equal(null)
    })
  })

  it('reports itself unavailable when connecting throws', () => {
    cy.then(async () => {
      const { options } = build({ connect: () => Promise.reject(new Error('nope')) })
      expect(await createServiceWorkerSink(options)).to.equal(null)
    })
  })

  it('hands the stream over and navigates at the download url', () => {
    cy.then(async () => {
      const { sent, navigated, options } = build()
      const sink = await createServiceWorkerSink(options)
      expect(sink?.streaming).to.equal(true)
      const drained: string[] = []
      const saving = sink?.save({ name: 'tree files.zip', body: streamOf(['one', 'two']) })
      sent[0].ack?.postMessage({ type: 'zipdl-started', id: sent[0].id })
      const handed = sent[0].stream as ReadableStream<Uint8Array>
      const reader = handed.getReader()
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) drained.push(new TextDecoder().decode(value))
      }
      sent[0].ack?.postMessage({ type: 'zipdl-closed', id: sent[0].id, bytes: 6 })
      await saving
      expect(drained.join('')).to.equal('onetwo')
      expect(sent).to.have.length(1)
      expect(sent[0].type).to.equal('zipdl-register')
      expect(sent[0].name).to.equal('tree files.zip')
      expect(navigated).to.have.length(1)
      expect(navigated[0]).to.contain('/zipdl/')
      expect(navigated[0]).to.contain(encodeURIComponent('tree files.zip'))
    })
  })

  it('does not start a run the caller has already abandoned', () => {
    cy.then(async () => {
      const { sent, navigated, options } = build()
      const sink = await createServiceWorkerSink(options)
      await sink?.save({
        name: 'stale.zip',
        body: streamOf(['bytes']),
        shouldSave: () => false
      })
      expect(sent).to.have.length(0)
      expect(navigated).to.have.length(0)
    })
  })

  it('gives up when the worker never acknowledges the handover', () => {
    cy.then(async () => {
      const silent = { postMessage: () => undefined } as unknown as ServiceWorker
      const { options, navigated } = build({ connect: () => Promise.resolve(silent) })
      const sink = await createServiceWorkerSink({ ...options, handoverMs: 50 })
      let message = ''
      await sink?.save({ name: 'silent.zip', body: streamOf(['bytes']) }).catch((error: Error) => {
        message = error.message
      })
      expect(message).to.contain('did not accept')
      expect(navigated, 'no download was started').to.have.length(0)
    })
  })

  it('abandons a download the browser never starts reading', () => {
    cy.then(async () => {
      const { options } = build()
      const sink = await createServiceWorkerSink(options)
      let message = ''
      await sink?.save({ name: 'unread.zip', body: streamOf(['bytes']) }).catch((error: Error) => {
        message = error.message
      })
      expect(message).to.contain('never started')
    })
  })
})

describe('createServiceWorkerSink over a MessageChannel', () => {
  interface Ported {
    type?: string
    id?: string
    name?: string
    port?: MessagePort
    ack?: MessagePort
  }

  const pumpFromWorkerSide = (message: Ported) => {
    const port = message.port as MessagePort
    message.ack?.postMessage({ type: 'zipdl-started', id: message.id })
    const chunks: Uint8Array[] = []
    const failures: string[] = []
    const finished = new Promise<void>((resolve) => {
      port.onmessage = (event: MessageEvent) => {
        const data = event.data as { type?: string; chunk?: ArrayBuffer; message?: string }
        if (data.type === 'chunk' && data.chunk) {
          chunks.push(new Uint8Array(data.chunk))
          port.postMessage({ type: 'pull' })
          return
        }
        if (data.type === 'error') {
          failures.push(data.message ?? '')
          resolve()
          return
        }
        message.ack?.postMessage({
          type: 'zipdl-closed',
          id: message.id,
          bytes: chunks.reduce((sum, chunk) => sum + chunk.byteLength, 0)
        })
        resolve()
      }
      port.postMessage({ type: 'pull' })
    })
    return { chunks, failures, finished }
  }

  const sinkWithPort = async (onRegister: (message: Ported) => void, onUnregister = () => {}) => {
    const worker = {
      postMessage: (message: Ported) => {
        if (message.type === 'zipdl-unregister') onUnregister()
        if (message.type !== 'zipdl-register') return
        onRegister(message)
        message.ack?.postMessage({ type: 'zipdl-registered', id: message.id, protocol: 2 })
      }
    } as unknown as ServiceWorker
    return createServiceWorkerSink({
      url: '/zip-download-sw.js',
      keepaliveMs: 20,
      firstByteMs: 2000,
      transferStreams: false,
      connect: () => Promise.resolve(worker),
      probe: () => Promise.resolve(true),
      navigate: () => () => undefined
    })
  }

  it('pumps the archive over the port when streams cannot be transferred', () => {
    cy.then(async () => {
      const pumps: ReturnType<typeof pumpFromWorkerSide>[] = []
      const sink = await sinkWithPort((message) => {
        pumps.push(pumpFromWorkerSide(message))
      })
      const body = new ReadableStream<Uint8Array>({
        start(controller) {
          const backing = new Uint8Array([9, 9, 65, 66, 67, 9])
          controller.enqueue(backing.subarray(2, 5))
          controller.enqueue(new TextEncoder().encode('DEF'))
          controller.close()
        }
      })
      await sink?.save({ name: 'ported.zip', body })
      await pumps[0].finished
      const joined = pumps[0].chunks.map((chunk) => new TextDecoder().decode(chunk)).join('')
      expect(joined).to.equal('ABCDEF')
      expect(pumps[0].failures).to.deep.equal([])
    })
  })

  it('unregisters the worker stream when archive production fails', () => {
    cy.then(async () => {
      let unregistered = false
      const sink = await sinkWithPort(
        (message) => {
          pumpFromWorkerSide(message)
        },
        () => {
          unregistered = true
        }
      )
      let sent = false
      const body = new ReadableStream<Uint8Array>({
        pull(controller) {
          if (!sent) {
            sent = true
            controller.enqueue(new TextEncoder().encode('half'))
            return
          }
          controller.error(new Error('source died'))
        }
      })
      let message = ''
      await sink?.save({ name: 'broken.zip', body }).catch((error: Error) => {
        message = error.message
      })
      expect(message).to.equal('source died')
      expect(unregistered).to.equal(true)
    })
  })
})

describe('ZIP worker completion protocol', () => {
  type Registration = {
    type: string
    id: string
    protocol: number
    stream?: ReadableStream<Uint8Array>
    port?: MessagePort
    ack: MessagePort
  }
  const setup = async (
    args: {
      protocol?: number
      acknowledge?: boolean
      bytes?: number
      transferChunks?: boolean
      navigate?: () => () => void
      onChunk?: (chunk: Uint8Array) => void
      onRegister?: (registration: Registration) => void
      onUnregister?: () => void
    } = {}
  ) => {
    const worker = {
      postMessage(message: Registration) {
        if (message.type === 'zipdl-unregister') {
          args.onUnregister?.()
          return
        }
        if (message.type !== 'zipdl-register') return
        args.onRegister?.(message)
        message.ack.postMessage({
          type: 'zipdl-registered',
          protocol: args.protocol ?? 2,
          id: message.id
        })
        let bytes = 0
        const port = message.port as MessagePort
        port.onmessage = ({ data }: MessageEvent<{ type: string; chunk: ArrayBuffer }>) => {
          if (data.type === 'chunk') {
            const chunk = new Uint8Array(data.chunk)
            bytes += chunk.byteLength
            args.onChunk?.(chunk)
            port.postMessage({ type: 'pull' })
          } else if (data.type === 'close' && args.acknowledge !== false) {
            message.ack.postMessage({
              type: 'zipdl-closed',
              id: message.id,
              bytes: args.bytes ?? bytes
            })
          }
        }
        message.ack.postMessage({ type: 'zipdl-started', id: message.id })
        port.postMessage({ type: 'pull' })
      }
    } as unknown as ServiceWorker
    const sink = await createServiceWorkerSink({
      url: '/zip-download-sw.js',
      transferStreams: false,
      transferChunks: args.transferChunks,
      completionMs: 40,
      handoverMs: 100,
      firstByteMs: 100,
      connect: () => Promise.resolve(worker),
      probe: () => Promise.resolve(true),
      navigate: args.navigate ?? (() => () => undefined)
    })
    if (!sink) throw new Error('Test sink unavailable')
    return sink
  }
  const body = (size = 3) =>
    new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(new Uint8Array(size).fill(42))
        controller.close()
      }
    })
  const errorFrom = (promise: Promise<void>) =>
    promise.then(
      () => '',
      (error: Error) => error.message
    )

  it('requires worker acknowledgement after the producer ends', () => {
    cy.then(async () => {
      const sink = await setup({ acknowledge: false })
      expect(await errorFrom(sink.save({ name: 'missing.zip', body: body() }))).to.contain(
        'did not confirm'
      )
    })
  })
  it('rejects mismatched worker byte counts', () => {
    cy.then(async () => {
      const sink = await setup({ bytes: 2 })
      expect(await errorFrom(sink.save({ name: 'mismatch.zip', body: body() }))).to.contain(
        'byte count'
      )
    })
  })
  it('rejects mismatched declared length', () => {
    cy.then(async () => {
      const sink = await setup()
      expect(
        await errorFrom(sink.save({ name: 'short.zip', body: body(), expectedBytes: 4 }))
      ).to.contain('byte count')
    })
  })
  it('rejects incompatible workers and releases the registration', () => {
    cy.then(async () => {
      let released = false
      const sink = await setup({
        protocol: 1,
        onUnregister: () => {
          released = true
        }
      })
      expect(await errorFrom(sink.save({ name: 'old.zip', body: body() }))).to.contain('outdated')
      expect(released).to.equal(true)
    })
  })
  for (const transferChunks of [false, true]) {
    it(`splits large views without changing bytes (${
      transferChunks ? 'transfer' : 'clone'
    })`, () => {
      cy.then(async () => {
        let total = 0
        const sink = await setup({
          transferChunks,
          onChunk: (chunk) => {
            expect(chunk.byteLength).to.be.at.most(256 * 1024)
            expect(chunk.every((byte) => byte === 42)).to.equal(true)
            total += chunk.byteLength
          }
        })
        await sink.save({
          name: 'large-chunk.zip',
          body: body(1024 * 1024 + 17),
          expectedBytes: 1024 * 1024 + 17
        })
        expect(total).to.equal(1024 * 1024 + 17)
      })
    })
  }
  it('cancels unfinished production and unregisters after navigation setup fails', () => {
    cy.then(async () => {
      let cancelled = false
      let released = false
      const sink = await setup({
        navigate: () => {
          throw new Error('navigation failed')
        },
        onUnregister: () => {
          released = true
        }
      })
      const stream = new ReadableStream<Uint8Array>({
        cancel() {
          cancelled = true
        }
      })
      expect(await errorFrom(sink.save({ name: 'setup.zip', body: stream }))).to.equal(
        'navigation failed'
      )
      expect(cancelled).to.equal(true)
      expect(released).to.equal(true)
    })
  })
  it('cancels a pending source read when the caller aborts', () => {
    cy.then(async () => {
      const abort = new AbortController()
      let cancelled = false
      const sink = await setup()
      const saving = sink.save({
        name: 'cancel.zip',
        signal: abort.signal,
        body: new ReadableStream<Uint8Array>({
          cancel() {
            cancelled = true
          }
        })
      })
      setTimeout(() => abort.abort('test interruption'), 20)
      expect(await errorFrom(saving)).to.contain('cancelled')
      expect(cancelled).to.equal(true)
    })
  })
})
