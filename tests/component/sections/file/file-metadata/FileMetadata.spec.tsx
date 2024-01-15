import { FileMetadata } from '../../../../../src/sections/file/file-metadata/FileMetadata'
import { FileMother } from '../../../files/domain/models/FileMother'

describe('FileMetadata', () => {
  it('renders the File Metadata tab', () => {
    cy.customMount(<FileMetadata file={FileMother.create()} />)

    cy.findByRole('button', { name: 'File Metadata' }).should('exist')
  })

  it('renders the file preview', () => {
    cy.customMount(<FileMetadata file={FileMother.create()} />)

    cy.findByText('Preview').should('exist')
    cy.findByRole('img').should('exist')
  })
})
