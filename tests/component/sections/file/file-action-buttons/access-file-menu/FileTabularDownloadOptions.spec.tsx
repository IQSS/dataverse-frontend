import {
  FileDownloadUrlsMother,
  FileTypeMother
} from '../../../../files/domain/models/FileMetadataMother'
import { FileTabularDownloadOptions } from '../../../../../../src/sections/file/file-action-buttons/access-file-menu/FileTabularDownloadOptions'
import { DatasetRepository } from '../../../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetLockMother, DatasetMother } from '../../../../dataset/domain/models/DatasetMother'
import { DatasetProvider } from '../../../../../../src/sections/dataset/DatasetProvider'

const tabularType = FileTypeMother.createTabular()
const downloadUrls = FileDownloadUrlsMother.create()
describe('FileTabularDownloadOptions', () => {
  it('renders the download options for a tabular file', () => {
    cy.customMount(
      <FileTabularDownloadOptions
        type={tabularType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
      />
    )

    cy.findByRole('link', { name: 'Comma Separated Values (Original File Format)' })
      .should('exist')
      .should('have.attr', 'href', downloadUrls.original)
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('have.attr', 'href', downloadUrls.tabular)
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' })
      .should('exist')
      .should('not.have.class', 'disabled')
      .should('have.attr', 'href', downloadUrls.rData)
  })

  it('renders the download options for a tabular file of unknown original type', () => {
    const unknownType = FileTypeMother.createTabularUnknown()
    cy.customMount(
      <FileTabularDownloadOptions
        type={unknownType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
      />
    )

    cy.findByRole('link', { name: /(Original File Format)/ }).should('not.exist')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('exist').should('not.have.class', 'disabled')
  })

  it('renders the options as disabled when the file ingest is in progress', () => {
    cy.customMount(
      <FileTabularDownloadOptions type={tabularType} downloadUrls={downloadUrls} ingestInProgress />
    )

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
        <FileTabularDownloadOptions
          type={tabularType}
          downloadUrls={downloadUrls}
          ingestInProgress={false}
        />
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
    const rDataType = FileTypeMother.createRData()
    cy.customMount(
      <FileTabularDownloadOptions
        type={rDataType}
        downloadUrls={downloadUrls}
        ingestInProgress={false}
      />
    )

    cy.findByRole('link', { name: 'R Data (Original File Format)' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'Tab-Delimited' })
      .should('exist')
      .should('not.have.class', 'disabled')
    cy.findByRole('link', { name: 'R Data' }).should('not.exist')
  })
})
