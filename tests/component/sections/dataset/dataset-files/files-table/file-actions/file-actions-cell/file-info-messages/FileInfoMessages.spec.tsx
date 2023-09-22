import { FileInfoMessages } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/FileInfoMessages'
import { FileMother } from '../../../../../../../files/domain/models/FileMother'

describe('FileInfoMessages', () => {
  it('renders the ingest message', () => {
    const file = FileMother.createIngestInProgress()
    cy.customMount(<FileInfoMessages file={file} />)

    cy.findByText('Ingest in progress...').should('exist')
  })

  it('renders the access requested message', () => {
    const file = FileMother.createWithAccessRequestPending()
    cy.customMount(<FileInfoMessages file={file} />)

    cy.findByText('Access Requested').should('exist')
  })
})
