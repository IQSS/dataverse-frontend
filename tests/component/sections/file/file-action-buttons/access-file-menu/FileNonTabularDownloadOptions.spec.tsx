import { FileMetadataMother } from '../../../../files/domain/models/FileMetadataMother'

import { FileNonTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileNonTabularDownloadOptions'
import { DatasetProvider } from '../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetLockMother, DatasetMother } from '../../../../dataset/domain/models/DatasetMother'
import { FilePreviewMother } from '../../../../files/domain/models/FilePreviewMother'
import { FileIngestMother } from '../../../../files/domain/models/FileIngestMother'

const fileNonTabular = FilePreviewMother.create({
  metadata: FileMetadataMother.createNonTabular(),
  ingest: FileIngestMother.createIngestNone()
})
describe('FileNonTabularDownloadOptions', () => {
  it('renders the download options for a non-tabular file of unknown type', () => {
    const fileNonTabularUnknown = FilePreviewMother.create({
      metadata: FileMetadataMother.createNonTabularUnknown(),
      ingest: FileIngestMother.createIngestNone()
    })
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabularUnknown} />)

    cy.findByRole('link', { name: 'Original File Format' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', fileNonTabularUnknown.metadata.downloadUrls.original)
  })

  it('renders the download options for a non-tabular file', () => {
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabular} />)

    cy.findByRole('link', { name: 'Plain Text' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', fileNonTabular.metadata.downloadUrls.original)
  })

  it('does not render the download options for a tabular file', () => {
    const fileTabular = FilePreviewMother.createTabular()
    cy.customMount(<FileNonTabularDownloadOptions file={fileTabular} />)

    cy.findByRole('link', { name: 'Original File Format' }).should('not.exist')
    cy.findByRole('link', { name: 'Tab-Delimited' }).should('not.exist')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    const fileNonTabularInProgress = FilePreviewMother.create({
      metadata: FileMetadataMother.createNonTabular(),
      ingest: FileIngestMother.createInProgress()
    })
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabularInProgress} />)

    cy.findByRole('link', { name: 'Plain Text' }).should('have.class', 'disabled')
  })

  it('renders the options as disabled when the dataset is locked from file download', () => {
    const datasetRepository: DatasetRepository = {} as DatasetRepository
    const datasetLockedFromFileDownload = DatasetMother.create({
      locks: [DatasetLockMother.createLockedFromFileDownload()]
    })
    datasetRepository.getByPersistentId = cy.stub().resolves(datasetLockedFromFileDownload)

    cy.customMount(
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: 'some-persistent-id', version: 'some-version' }}>
        <FileNonTabularDownloadOptions file={fileNonTabular} />
      </DatasetProvider>
    )

    cy.findByRole('link', { name: 'Plain Text' }).should('have.class', 'disabled')
  })
})
