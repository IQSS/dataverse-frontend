import { FileMetadata } from '../../../../../src/sections/file/file-metadata/FileMetadata'

describe('FileMetadata', () => {
  it('renders the File Metadata tab', () => {
    cy.customMount(<FileMetadata />)

    cy.findByRole('button', { name: 'File Metadata' }).should('exist')
  })

  it('renders the file preview', () => {
    cy.customMount(<FileMetadata />)

    cy.findByText('Preview').should('exist')
  })
})
