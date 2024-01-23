import { FileMetadataMother } from '../../../../../../../../files/domain/models/FileMetadataMother'
import { FileType } from '../../../../../../../../../../src/files/domain/models/FileMetadata'
import { FileTabularDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileTabularDownloadOptions'
import { DatasetRepository } from '../../../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetLockMother,
  DatasetMother
} from '../../../../../../../../dataset/domain/models/DatasetMother'
import { DatasetProvider } from '../../../../../../../../../../src/sections/dataset/DatasetProvider'
import { FilePreviewMother } from '../../../../../../../../files/domain/models/FilePreviewMother'
import { FileIngestMother } from '../../../../../../../../files/domain/models/FileIngestMother'

const fileNonTabular = FilePreviewMother.createNonTabular()
const fileTabular = FilePreviewMother.createTabular()
const fileTabularUnknown = FilePreviewMother.create({
  metadata: FileMetadataMother.createTabular({
    type: new FileType('text/tab-separated-values', 'Unknown')
  }),
  ingest: FileIngestMother.createIngestNone()
})
describe('FileTabularDownloadOptions', () => {
  it('renders the download options for a tabular file', () => {
    cy.customMount(<FileTabularDownloadOptions file={fileTabular} />)

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.attr', 'href', fileTabular.metadata.downloadUrls.original)
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.attr', 'href', fileTabular.metadata.downloadUrls.tabular)
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', fileTabular.metadata.downloadUrls.rData)
  })

  it('renders the download options for a tabular file of unknown original type', () => {
    cy.customMount(<FileTabularDownloadOptions file={fileTabularUnknown} />)

    cy.findByRole('link', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('exist').should('not.have.class', 'disabled')
  })

  it('does not render the download options for a non-tabular file', () => {
    cy.customMount(<FileTabularDownloadOptions file={fileNonTabular} />)

    cy.findByRole('link', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('link', { name: 'Tab-Delimited' }).should('not.exist')
    cy.findByRole('link', { name: 'R Data' }).should('not.exist')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    const fileTabularInProgress = FilePreviewMother.createTabular({
      ingest: FileIngestMother.createInProgress()
    })
    cy.customMount(<FileTabularDownloadOptions file={fileTabularInProgress} />)

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
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
        <FileTabularDownloadOptions file={fileTabular} />
      </DatasetProvider>
    )

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
  })

  it('does not render the RData option if the file type is already R Data', () => {
    const fileTabularRData = FilePreviewMother.create({
      metadata: FileMetadataMother.createTabular({
        type: new FileType('application/octet-stream', 'R Data')
      })
    })
    cy.customMount(<FileTabularDownloadOptions file={fileTabularRData} />)

    cy.findByRole('link', { name: 'R Data (Original File Format)' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('not.exist')
  })
})
