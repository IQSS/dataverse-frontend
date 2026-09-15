import { DatasetPublishingStatus } from '../../../../../../../../../src/dataset/domain/models/Dataset'
import { FileDownloads } from '../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-info/file-info-cell/file-info-data/FileDownloads'
import i18n from '@/i18n'

describe('FileDownloads', () => {
  beforeEach(() => cy.wrap(i18n.changeLanguage('en')))
  afterEach(() => cy.wrap(i18n.changeLanguage('en')))

  it('renders the number of downloads when file is RELEASED', () => {
    const downloads = 10
    const status = DatasetPublishingStatus.RELEASED
    cy.customMount(<FileDownloads downloadCount={downloads} datasetPublishingStatus={status} />)

    cy.findByText('10 Downloads').should('exist')
  })

  it('formats the download count with the active language', () => {
    cy.wrap(i18n.changeLanguage('es')).then(() => {
      cy.customMount(
        <FileDownloads
          downloadCount={53_305}
          datasetPublishingStatus={DatasetPublishingStatus.RELEASED}
        />
      )
    })

    cy.findByText('53.305 Descargas').should('exist')
  })

  it('renders an empty fragment when file is not RELEASED', () => {
    const downloads = 10
    const status = DatasetPublishingStatus.DRAFT
    cy.customMount(<FileDownloads downloadCount={downloads} datasetPublishingStatus={status} />)

    cy.findByText('10 Downloads').should('not.exist')
  })
})
