import { FileStatus } from '../../../../../../../src/files/domain/models/File'
import { FileDownloads } from '../../../../../../../src/sections/dataset/dataset-files/files-table/file-info-cell/FileDownloads'

describe('FileDownloads', () => {
  it('renders the number of downloads when file is RELEASED', () => {
    const downloads = 10
    const status = FileStatus.RELEASED
    cy.customMount(<FileDownloads downloads={downloads} status={status} />)

    cy.findByText('10 Downloads').should('exist')
  })

  it('renders an empty fragment when file is not RELEASED', () => {
    const downloads = 10
    const status = FileStatus.DRAFT
    cy.customMount(<FileDownloads downloads={downloads} status={status} />)

    cy.findByText('10 Downloads').should('not.exist')
  })
})
