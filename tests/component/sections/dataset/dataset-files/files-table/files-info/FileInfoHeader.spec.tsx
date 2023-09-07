import { FileInfoHeader } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/FileInfoHeader'
import { FilePaginationInfo } from '../../../../../../../src/files/domain/models/FilePaginationInfo'

describe('FileInfoHeader', () => {
  it('renders the file info header', () => {
    const paginationInfo: FilePaginationInfo = new FilePaginationInfo(1, 100, 100)
    cy.customMount(<FileInfoHeader paginationInfo={paginationInfo} />)

    cy.findByText('1 to 100 of 100 Files').should('exist')
  })

  it('renders the file info header when the totalFiles does not complete a full pageSize', () => {
    const paginationInfo: FilePaginationInfo = new FilePaginationInfo(2, 10, 15)

    cy.customMount(<FileInfoHeader paginationInfo={paginationInfo} />)

    cy.findByText('11 to 15 of 15 Files').should('exist')
  })

  it('does not render the file info header when there are no files', () => {
    const paginationInfo: FilePaginationInfo = new FilePaginationInfo(1, 100, 0)
    cy.customMount(<FileInfoHeader paginationInfo={paginationInfo} />)

    cy.findByText('1 to 100 of 100 Files').should('not.exist')
  })
})
