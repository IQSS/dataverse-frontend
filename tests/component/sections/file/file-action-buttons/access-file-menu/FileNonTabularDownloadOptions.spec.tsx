import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'

import { FileNonTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileNonTabularDownloadOptions'
import { DatasetProvider } from '../../../../../../src/sections/dataset/DatasetProvider'
import { DatasetRepository } from '../../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetLockMother, DatasetMother } from '../../../../dataset/domain/models/DatasetMother'

const unknownType = FileTypeMother.createUnknown()
const downloadUrls = FileDownloadUrlsMother.create()
const textType = FileTypeMother.createText()
describe('FileNonTabularDownloadOptions', () => {
  it('renders the download options for a file of unknown type', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        type={unknownType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
      />
    )

    cy.findByRole('link', { name: 'Original File Format' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', downloadUrls.original)
  })

  it('renders the download options for a file of known type', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress={false}
      />
    )

    cy.findByRole('link', { name: 'Plain Text' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', downloadUrls.original)
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    cy.customMount(
      <FileNonTabularDownloadOptions
        type={textType}
        downloadUrlOriginal={downloadUrls.original}
        ingestIsInProgress
      />
    )

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
        <FileNonTabularDownloadOptions
          type={textType}
          downloadUrlOriginal={downloadUrls.original}
          ingestIsInProgress={false}
        />
      </DatasetProvider>
    )

    cy.findByRole('link', { name: 'Plain Text' }).should('have.class', 'disabled')
  })
})
