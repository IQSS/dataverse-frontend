import { FilesTreeDownloadTray } from '../../../../../../src/sections/dataset/dataset-files/files-tree/FilesTreeDownloadTray'
import {
  StreamingZipApi,
  StreamingZipState
} from '../../../../../../src/sections/dataset/dataset-files/files-tree/useStreamingZipDownload'

function makeApi(state: Partial<StreamingZipState>): StreamingZipApi {
  const fullState: StreamingZipState = {
    status: 'preparing',
    totalFiles: 0,
    filesDone: 0,
    totalBytes: 0,
    bytesDone: 0,
    failedSoFar: [],
    pass: 1,
    ...state
  }
  return {
    state: fullState,
    start: () => undefined,
    retryCurrent: cy.stub().as('retryCurrent'),
    skipCurrent: cy.stub().as('skipCurrent'),
    skipAllFailures: cy.stub().as('skipAllFailures'),
    deferCurrentToEnd: cy.stub().as('deferCurrentToEnd'),
    retryFailed: cy.stub().as('retryFailed'),
    cancel: cy.stub().as('cancel'),
    close: cy.stub().as('close')
  }
}

describe('FilesTreeDownloadTray', () => {
  it('shows the running title when bytes are flowing and a Cancel button in the footer', () => {
    cy.mount(
      <FilesTreeDownloadTray
        api={makeApi({
          status: 'running',
          totalFiles: 3,
          filesDone: 1,
          totalBytes: 100,
          bytesDone: 25
        })}
        open
        onClose={() => undefined}
      />
    )
    cy.findByText(/Streaming files into zip/i).should('exist')
    cy.findByRole('button', { name: /Cancel/i }).should('exist')
    // No "Close" button while running.
    cy.findAllByRole('button', { name: /Close/i }).should('have.length', 1) // the × close icon
  })

  it('renders the "Done" title when status is done and no failures', () => {
    cy.mount(
      <FilesTreeDownloadTray
        api={makeApi({ status: 'done', totalFiles: 3, filesDone: 3 })}
        open
        onClose={() => undefined}
      />
    )
    cy.findByText(/Download complete/i).should('exist')
    // Done state: header × close + footer Close = 2 close buttons. No Cancel.
    cy.findAllByRole('button', { name: /Close/i }).should('have.length', 2)
    cy.findByRole('button', { name: /Cancel/i }).should('not.exist')
  })

  it('renders the manifest hint when status is done with skipped files', () => {
    const failed = [
      { path: 'a.txt', name: 'a.txt', size: 100, error: 'HTTP 404', recoverable: false },
      { path: 'b.txt', name: 'b.txt', size: 100, error: 'HTTP 404', recoverable: false }
    ]
    cy.mount(
      <FilesTreeDownloadTray
        api={makeApi({ status: 'done', totalFiles: 3, filesDone: 1, failedSoFar: failed })}
        open
        onClose={() => undefined}
      />
    )
    cy.findByText(/Download complete — 2 skipped/i).should('exist')
    cy.findByText(/manifest\.txt/i).should('exist')
  })

  it('shows the paused dialog with Retry / Skip / Skip & retry / Skip all buttons', () => {
    const failed = [
      { path: 'data/x.txt', name: 'x.txt', size: 100, error: 'HTTP 500', recoverable: true }
    ]
    const api = makeApi({ status: 'paused', totalFiles: 3, filesDone: 1, failedSoFar: failed })
    cy.mount(<FilesTreeDownloadTray api={api} open onClose={() => undefined} />)
    cy.findByText(/Download paused/i).should('exist')
    cy.findByText(/data\/x\.txt/).should('exist')

    cy.findByRole('button', { name: /Retry this file/i }).click()
    cy.get('@retryCurrent').should('have.been.calledOnce')

    cy.findByRole('button', { name: /^Skip$/i }).click()
    cy.get('@skipCurrent').should('have.been.calledOnce')

    cy.findByRole('button', { name: /Skip & retry at end/i }).click()
    cy.get('@deferCurrentToEnd').should('have.been.calledOnce')

    cy.findByRole('button', { name: /Skip all remaining failures/i }).click()
    cy.get('@skipAllFailures').should('have.been.calledOnce')
  })

  it('shows the awaiting-retry block with Download missing files / Done buttons', () => {
    const failed = [
      { path: 'a.txt', name: 'a.txt', size: 100, error: 'HTTP 500', recoverable: true },
      { path: 'b.txt', name: 'b.txt', size: 100, error: 'HTTP 500', recoverable: true }
    ]
    const api = makeApi({
      status: 'awaiting-retry',
      totalFiles: 3,
      filesDone: 1,
      failedSoFar: failed,
      pass: 1
    })
    const onClose = cy.stub()
    cy.mount(<FilesTreeDownloadTray api={api} open onClose={onClose} />)
    cy.findByText(/First pass complete/i).should('exist')

    cy.findByRole('button', { name: /Download 2 missing file/i }).click()
    cy.get('@retryFailed').should('have.been.calledOnce')

    cy.findByRole('button', { name: /^Done$/i }).click()
    cy.then(() => expect(onClose).to.have.been.calledOnce)
  })

  it('shows the cancelled title and footer Close after a cancel', () => {
    cy.mount(
      <FilesTreeDownloadTray
        api={makeApi({ status: 'cancelled' })}
        open
        onClose={() => undefined}
      />
    )
    cy.findByText(/Download cancelled/i).should('exist')
    cy.findAllByRole('button', { name: /Close/i }).should('have.length', 2)
  })

  it('clicking the overlay while done invokes onClose', () => {
    const onClose = cy.stub()
    cy.mount(
      <FilesTreeDownloadTray
        api={makeApi({ status: 'done', filesDone: 2, totalFiles: 2 })}
        open
        onClose={onClose}
      />
    )
    cy.get('[aria-hidden="true"]').first().click({ force: true })
    cy.then(() => expect(onClose).to.have.been.called)
  })

  it('clicking the overlay while running is a no-op (no onClose)', () => {
    const onClose = cy.stub()
    cy.mount(
      <FilesTreeDownloadTray
        api={makeApi({ status: 'running', filesDone: 1, totalFiles: 3 })}
        open
        onClose={onClose}
      />
    )
    cy.get('[aria-hidden="true"]').first().click({ force: true })
    cy.then(() => expect(onClose).not.to.have.been.called)
  })

  it('renders the pass-2 hint while in second-pass running', () => {
    cy.mount(
      <FilesTreeDownloadTray
        api={makeApi({
          status: 'running',
          filesDone: 1,
          totalFiles: 3,
          pass: 2,
          bytesDone: 10,
          totalBytes: 100
        })}
        open
        onClose={() => undefined}
      />
    )
    cy.findByText(/pass 2 of 2/i).should('exist')
  })
})
