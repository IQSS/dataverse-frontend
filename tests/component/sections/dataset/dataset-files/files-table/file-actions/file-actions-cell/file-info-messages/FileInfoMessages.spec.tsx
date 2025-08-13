import { FileInfoMessages } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/FileInfoMessages'
import { FilePreviewMother } from '../../../../../../../files/domain/models/FilePreviewMother'

describe('FileInfoMessages', () => {
  it('renders the ingest message', () => {
    const file = FilePreviewMother.createIngestInProgress()
    cy.customMount(<FileInfoMessages file={file} />)

    cy.findByText('Ingest in progress...').should('exist')
  })

  it('renders the access requested message', () => {
    const file = FilePreviewMother.createWithAccessRequestPending()
    cy.customMount(<FileInfoMessages file={file} />)

    cy.findByText('Access Requested').should('exist')
  })
})
