import { FileInfoMessages } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-info-messages/FileInfoMessages'
import { FileMother } from '../../../../../../../files/domain/models/FileMother'

const file = FileMother.createDefault()
describe('FileInfoMessages', () => {
  it.skip('renders the ingest in progress message', () => {
    cy.customMount(<FileInfoMessages file={file} />)

    cy.findByText('Ingest in progress...').should('exist')
  })

  it.skip('renders the ingest problem message', () => {
    cy.customMount(<FileInfoMessages file={file} />)

    cy.findByText('File available in original format only').should('exist')
  })

  it('renders the access requested message', () => {
    const file = FileMother.createWithAccessRequestPending()
    cy.customMount(<FileInfoMessages file={file} />)

    cy.findByText('Access requested').should('exist')
  })
})
