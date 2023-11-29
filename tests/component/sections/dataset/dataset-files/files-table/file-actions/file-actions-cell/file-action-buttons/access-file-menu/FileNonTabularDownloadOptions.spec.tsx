import { FileMother } from '../../../../../../../../files/domain/models/FileMother'
import {
  FileIngestStatus,
  FileType
} from '../../../../../../../../../../src/files/domain/models/File'
import { FileNonTabularDownloadOptions } from '../../../../../../../../../../src/sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/FileNonTabularDownloadOptions'
import { DatasetProvider } from '../../../../../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../../../../../src/dataset/domain/repositories/DatasetRepository'
import {
  DatasetLockMother,
  DatasetMother
} from '../../../../../../../../dataset/domain/models/DatasetMother'

const fileNonTabular = FileMother.create({
  tabularData: undefined,
  type: new FileType('text/plain')
})
describe('FileNonTabularDownloadOptions', () => {
  it('renders the download options for a non-tabular file of unknown type', () => {
    const fileNonTabularUnknown = FileMother.create({
      tabularData: undefined,
      type: new FileType('unknown')
    })
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabularUnknown} />)

    cy.findByRole('button', { name: 'Original File Format' })
      .should('exist')
      .should('not.have.class', 'disabled')
  })

  it('renders the download options for a non-tabular file', () => {
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabular} />)

    cy.findByRole('button', { name: 'Plain Text' })
      .should('exist')
      .should('not.have.class', 'disabled')
  })

  it('does not render the download options for a tabular file', () => {
    const fileTabular = FileMother.createWithTabularData()
    cy.customMount(<FileNonTabularDownloadOptions file={fileTabular} />)

    cy.findByRole('button', { name: 'Original File Format' }).should('not.exist')
    cy.findByRole('button', { name: 'Tab-Delimited' }).should('not.exist')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    const fileNonTabularInProgress = FileMother.create({
      tabularData: undefined,
      type: new FileType('text/plain'),
      ingest: {
        status: FileIngestStatus.IN_PROGRESS
      }
    })
    cy.customMount(<FileNonTabularDownloadOptions file={fileNonTabularInProgress} />)

    cy.findByRole('button', { name: 'Plain Text' }).should('have.class', 'disabled')
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

    cy.findByRole('button', { name: 'Plain Text' }).should('have.class', 'disabled')
  })
})
