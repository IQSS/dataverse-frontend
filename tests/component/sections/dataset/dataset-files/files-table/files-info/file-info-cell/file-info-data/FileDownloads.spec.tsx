import { DatasetPublishingStatus } from '../../../../../../../../../src/dataset/domain/models/Dataset'
import { FileDownloads } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDownloads'

describe('FileDownloads', () => {
  it('renders the number of downloads when file is RELEASED', () => {
    const downloads = 10
    const status = DatasetPublishingStatus.RELEASED
    cy.customMount(<FileDownloads downloadCount={downloads} datasetPublishingStatus={status} />)

    cy.findByText('10 Downloads').should('exist')
  })

  it('renders an empty fragment when file is not RELEASED', () => {
    const downloads = 10
    const status = DatasetPublishingStatus.DRAFT
    cy.customMount(<FileDownloads downloadCount={downloads} datasetPublishingStatus={status} />)

    cy.findByText('10 Downloads').should('not.exist')
  })
})
