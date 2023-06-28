import { FileDirectory } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileDirectory'

describe('FileDirectory', () => {
  it('renders nothing when directory is undefined', () => {
    cy.customMount(<FileDirectory directory={undefined} />)

    cy.get('.directory-container').should('not.exist')
  })

  it('renders the directory when directory is provided', () => {
    const directory = 'example/directory'
    cy.customMount(<FileDirectory directory={directory} />)

    cy.findByText(directory).should('exist')
  })
})
