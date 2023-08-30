import { FileInfoHeader } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/FileInfoHeader'

describe('FileInfoHeader', () => {
  it('renders the file info header', () => {
    cy.customMount(<FileInfoHeader pageCount={1} pageIndex={0} pageSize={100} />)

    cy.findByText('1 to 100 of 100 Files').should('exist')
  })

  it('does not render the file info header when there are no files', () => {
    cy.customMount(<FileInfoHeader pageCount={0} pageIndex={0} pageSize={100} />)

    cy.findByText('1 to 100 of 100 Files').should('not.exist')
  })
})
