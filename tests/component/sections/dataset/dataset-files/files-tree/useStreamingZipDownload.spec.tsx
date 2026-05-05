import { useState } from 'react'
import { useStreamingZipDownload } from '../../../../../../src/sections/dataset/dataset-files/files-tree/useStreamingZipDownload'
import { FilesTreeDownloadTray } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTreeDownloadTray'
import { FileTreeFile } from '../../../../../../src/files/domain/models/FileTreeItem'
import { FileTreeFileMother } from '../../../../files/domain/models/FileTreeItemMother'

/**
 * Harness component: renders the tray plus a kick-off button that
 * starts the engine. Lets the spec drive the engine end-to-end via the
 * same code path the host (FilesTree) uses.
 */
function StreamingZipHarness({ files, zipName }: { files: FileTreeFile[]; zipName: string }) {
  const api = useStreamingZipDownload()
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        data-testid="harness-start"
        onClick={() => {
          api.start({ files, zipName })
          setOpen(true)
        }}>
        Start
      </button>
      <FilesTreeDownloadTray
        api={api}
        open={open}
        onClose={() => {
          setOpen(false)
          api.close()
        }}
      />
    </>
  )
}

function fakeResponseBody(content: string): Response {
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(new TextEncoder().encode(content))
      controller.close()
    }
  })
  return new Response(stream, {
    status: 200,
    headers: { 'content-type': 'application/octet-stream' }
  })
}

describe('useStreamingZipDownload + FilesTreeDownloadTray', () => {
  beforeEach(() => {
    // Prevent `<a download>` clicks from actually navigating the cypress runner.
    cy.window().then((win) => {
      const noop = () => undefined
      cy.stub(win.HTMLAnchorElement.prototype, 'click').callsFake(noop)
    })
  })

  it('streams two files into a zip on the happy path', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 5,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'b.txt',
        path: 'b.txt',
        size: 5,
        downloadUrl: '/access/2'
      })
    ]

    cy.window().then((win) => {
      cy.stub(win, 'fetch').callsFake((input: RequestInfo | URL) => {
        const url = String(input)
        if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAAAA'))
        if (url.endsWith('/access/2')) return Promise.resolve(fakeResponseBody('BBBBB'))
        return Promise.reject(new Error(`unexpected fetch ${url}`))
      })
    })

    cy.customMount(<StreamingZipHarness files={files} zipName="test.zip" />)
    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray').should('be.visible')
    cy.findByTestId('files-tree-download-tray-meta').should('contain.text', '2 / 2')
    cy.contains(/download complete/i).should('exist')
  })

  it('pauses on first failure and resumes on retry', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'b.txt',
        path: 'b.txt',
        size: 3,
        downloadUrl: '/access/2'
      })
    ]

    let attempts = 0
    cy.window().then((win) => {
      cy.stub(win, 'fetch').callsFake((input: RequestInfo | URL) => {
        const url = String(input)
        if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
        if (url.endsWith('/access/2')) {
          attempts += 1
          if (attempts === 1) return Promise.reject(new Error('network blip'))
          return Promise.resolve(fakeResponseBody('BBB'))
        }
        return Promise.reject(new Error(`unexpected fetch ${url}`))
      })
    })

    cy.customMount(<StreamingZipHarness files={files} zipName="retry.zip" />)
    cy.findByTestId('harness-start').click()

    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/Retry this file/i).click()
    cy.contains(/download complete/i).should('exist')
    cy.then(() => {
      expect(attempts).to.equal(2)
    })
  })

  it('skips a failed file when "Skip" is clicked and lists it in the manifest', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'broken.bin',
        path: 'broken.bin',
        size: 3,
        downloadUrl: '/access/2'
      })
    ]

    cy.window().then((win) => {
      cy.stub(win, 'fetch').callsFake((input: RequestInfo | URL) => {
        const url = String(input)
        if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
        return Promise.reject(new Error('permanently broken'))
      })
    })

    cy.customMount(<StreamingZipHarness files={files} zipName="skip.zip" />)
    cy.findByTestId('harness-start').click()
    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/^Skip$/).click()
    cy.contains(/Download complete — 1 skipped/i).should('exist')
  })

  it('switches to two-pass on "Skip & retry at end" and finishes after retry', () => {
    const files: FileTreeFile[] = [
      FileTreeFileMother.create({
        id: 1,
        name: 'a.txt',
        path: 'a.txt',
        size: 3,
        downloadUrl: '/access/1'
      }),
      FileTreeFileMother.create({
        id: 2,
        name: 'flaky.bin',
        path: 'flaky.bin',
        size: 3,
        downloadUrl: '/access/2'
      }),
      FileTreeFileMother.create({
        id: 3,
        name: 'c.txt',
        path: 'c.txt',
        size: 3,
        downloadUrl: '/access/3'
      })
    ]

    let flakyAttempts = 0
    cy.window().then((win) => {
      cy.stub(win, 'fetch').callsFake((input: RequestInfo | URL) => {
        const url = String(input)
        if (url.endsWith('/access/1')) return Promise.resolve(fakeResponseBody('AAA'))
        if (url.endsWith('/access/3')) return Promise.resolve(fakeResponseBody('CCC'))
        if (url.endsWith('/access/2')) {
          flakyAttempts += 1
          // Fails on the first pass; succeeds during the second-pass retry.
          if (flakyAttempts === 1) return Promise.reject(new Error('flaky network'))
          return Promise.resolve(fakeResponseBody('BBB'))
        }
        return Promise.reject(new Error(`unexpected fetch ${url}`))
      })
    })

    cy.customMount(<StreamingZipHarness files={files} zipName="twopass.zip" />)
    cy.findByTestId('harness-start').click()

    cy.findByTestId('files-tree-download-tray-failure').should('be.visible')
    cy.contains(/Skip & retry at end/i).click()

    cy.findByTestId('files-tree-download-tray-twopass').should('be.visible')
    cy.contains(/Download 1 missing file/i).click()
    cy.contains(/download complete/i).should('exist')
    cy.then(() => {
      expect(flakyAttempts).to.equal(2)
    })
  })
})
