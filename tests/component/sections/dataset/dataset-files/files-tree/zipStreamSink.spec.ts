import {
  createBlobSink,
  pullDrivenStream,
  resolveZipSink,
  scopeCoversPage,
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

describe('scopeCoversPage', () => {
  it('accepts a page inside the worker scope', () => {
    expect(scopeCoversPage('/modern/', '/modern/datasets/123')).to.equal(true)
  })

  it('accepts the scope root itself', () => {
    expect(scopeCoversPage('/modern/', '/modern/')).to.equal(true)
  })

  it('accepts everything when the worker is at the site root', () => {
    expect(scopeCoversPage('/', '/dataset.xhtml')).to.equal(true)
  })

  it('rejects a JSF page outside the components scope', () => {
    expect(scopeCoversPage('/reusable-components/', '/dataset.xhtml')).to.equal(false)
  })

  it('accepts the scope root served without its trailing slash', () => {
    expect(scopeCoversPage('/modern/', '/modern')).to.equal(true)
  })

  it('does not treat a shared prefix as containment', () => {
    expect(scopeCoversPage('/modern/', '/modern-ui/page')).to.equal(false)
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

  it('rejects when the source errors instead of ending quietly', () => {
    cy.then(async () => {
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
})
