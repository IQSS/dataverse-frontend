import { FileDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileDownloadOptions'
import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import {
  FileIngestStatus,
  FileType
} from '../../../../../../../../../../src/files/domain/models/File'
import { FileTabularDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileTabularDownloadOptions'
import { DatasetRepository } from '../../../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetLockMother,
  DatasetMother
} from '../../../../../../../../dataset/domain/models/DatasetMother'
import { DatasetProvider } from '../../../../../../../../../../src/sections/dataset/DatasetProvider'

const fileNonTabular = FileMother.create({
  tabularData: undefined,
  type: new FileType('text/plain')
})
const fileTabular = FileMother.createWithTabularData()
const fileTabularUnknown = FileMother.createWithTabularData({
  type: new FileType('text/tab-separated-values', 'Unknown')
})
describe('FileTabularDownloadOptions', () => {
  it('renders the download options for a tabular file', () => {
    cy.customMount(<FileTabularDownloadOptions file={fileTabular} />)

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' }).should(
      'exist'
    )
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('exist').should('not.have.class', 'disabled')
  })

  it('renders the download options for a tabular file of unknown original type', () => {
    cy.customMount(<FileDownloadOptions file={fileTabularUnknown} />)

    cy.findByRole('button', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('exist').should('not.have.class', 'disabled')
  })

  it('does not render the download options for a non-tabular file', () => {
    cy.customMount(<FileTabularDownloadOptions file={fileNonTabular} />)

    cy.findByRole('button', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('button', { name: 'Tab-Delimited' }).should('not.exist')
    cy.findByRole('button', { name: 'R Data' }).should('not.exist')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    const fileTabularInProgress = FileMother.createWithTabularData({
      ingest: {
        status: FileIngestStatus.IN_PROGRESS
      }
    })
    cy.customMount(<FileTabularDownloadOptions file={fileTabularInProgress} />)

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
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

    cy.findByRole('button', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('exist').should('have.class', 'disabled')
  })

  it('does not render the RData option if the file type is already R Data', () => {
    const fileTabularRData = FileMother.createWithTabularData({
      type: new FileType('text/tab-separated-values', 'R Data')
    })
    cy.customMount(<FileTabularDownloadOptions file={fileTabularRData} />)

    cy.findByRole('button', { name: 'R Data (Original File Format)' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('button', { name: 'R Data' }).should('not.exist')
  })
})
