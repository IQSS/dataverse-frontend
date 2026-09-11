import {
  createBlobSink,
  resolveZipSink,
  scopeCoversPage,
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
