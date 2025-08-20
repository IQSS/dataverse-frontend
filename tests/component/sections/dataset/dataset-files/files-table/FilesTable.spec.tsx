import { FileMetadataMother } from '../../../../files/domain/models/FileMetadataMother'
import {
  FilesTable,
  getCellStyle
} from '../../../../../../src/sections/dataset/dataset-files/files-table/FilesTable'
import { FileSize, FileSizeUnit } from '../../../../../../src/files/domain/models/FileMetadata'
import { SettingMother } from '../../../../settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../../../../../../src/settings/domain/models/ZipDownloadLimit'
import { SettingsProvider } from '@/sections/settings/SettingsProvider'
import styles from '../../../../../../src/sections/dataset/dataset-files/files-table/FilesTable.module.scss'
import { FileCriteria } from '../../../../../../src/files/domain/models/FileCriteria'
import { FilePaginationInfo } from '../../../../../../src/files/domain/models/FilePaginationInfo'
import { FilePreviewMother } from '../../../../files/domain/models/FilePreviewMother'
import { FileRepository } from '@/files/domain/repositories/FileRepository'
import { DataverseInfoRepository } from '@/info/domain/repositories/DataverseInfoRepository'
import { DatasetRepository } from '@/dataset/domain/repositories/DatasetRepository'

const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository
const testFiles = FilePreviewMother.createMany(10)
const paginationInfo = new FilePaginationInfo(1, 10, 200)
const testFilesTotalDownloadSize = 19900
const defaultCriteria = new FileCriteria()
describe('FilesTable', () => {
  it('renders the files table', () => {
    cy.customMount(
      <FilesTable
        files={testFiles}
        paginationInfo={paginationInfo}
        isLoading={false}
        filesTotalDownloadSize={testFilesTotalDownloadSize}
        criteria={defaultCriteria}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
    )

    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: '1 to 10 of 200 Files' }).should('exist')
    cy.get('table > thead > tr > th:nth-child(1) > input[type="checkbox"]').should('exist')

    testFiles.slice(0, 10).forEach((file) => {
      cy.findByText(file.name).should('exist')
    })
  })

  it('renders the spinner when the data isLoading', () => {
    cy.customMount(
      <FilesTable
        files={testFiles}
        paginationInfo={paginationInfo}
        isLoading={true}
        filesTotalDownloadSize={testFilesTotalDownloadSize}
        criteria={defaultCriteria}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
    )

    cy.findByLabelText('Files loading spinner symbol').should('exist')
  })

  it('renders the no files message when there are no files', () => {
    cy.customMount(
      <FilesTable
        files={[]}
        paginationInfo={paginationInfo}
        isLoading={false}
        filesTotalDownloadSize={testFilesTotalDownloadSize}
        criteria={defaultCriteria}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
    )

    cy.findByText('There are no files in this dataset.').should('exist')
  })

  describe('Row selection', () => {
    it('selects all rows in the current page when the header checkbox is clicked', () => {
      cy.customMount(
        <FilesTable
          files={testFiles}
          paginationInfo={paginationInfo}
          isLoading={false}
          filesTotalDownloadSize={testFilesTotalDownloadSize}
          criteria={defaultCriteria}
          fileRepository={fileRepository}
          datasetRepository={datasetRepository}
        />
      )

      cy.wait(1000) // wait for the table to load

      cy.get('table > thead > tr > th > input[type=checkbox]').click()

      cy.findByText('10 files are currently selected.').should('exist')

      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).should('exist')
    })

    it('clears row selection for the current page when the header checkbox is clicked', () => {
      cy.customMount(
        <FilesTable
          files={testFiles}
          paginationInfo={paginationInfo}
          isLoading={false}
          filesTotalDownloadSize={testFilesTotalDownloadSize}
          criteria={defaultCriteria}
          fileRepository={fileRepository}
          datasetRepository={datasetRepository}
        />
      )

      cy.wait(1000) // wait for the table to load

      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()

      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()

      cy.findByText('200 files are currently selected.').should('exist')

      cy.get('table > thead > tr > th > input[type=checkbox]').click()

      cy.findByText('190 files are currently selected.').should('exist')
    })

    it("selects all rows when the 'Select all' button is clicked", () => {
      cy.customMount(
        <FilesTable
          files={testFiles}
          paginationInfo={paginationInfo}
          isLoading={false}
          filesTotalDownloadSize={testFilesTotalDownloadSize}
          criteria={defaultCriteria}
          fileRepository={fileRepository}
          datasetRepository={datasetRepository}
        />
      )

      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()

      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()

      cy.findByText('200 files are currently selected.').should('exist')

      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).should('not.exist')
    })

    it('clears the selection when the clear selection button is clicked', () => {
      cy.customMount(
        <FilesTable
          files={testFiles}
          paginationInfo={paginationInfo}
          isLoading={false}
          filesTotalDownloadSize={testFilesTotalDownloadSize}
          criteria={defaultCriteria}
          fileRepository={fileRepository}
          datasetRepository={datasetRepository}
        />
      )

      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()

      cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()

      cy.findByText('200 files are currently selected.').should('exist')

      cy.findByRole('button', { name: 'Clear selection.' }).click()

      cy.findByText(/files are currently selected./).should('not.exist')
    })

    it('highlights the selected rows', () => {
      cy.customMount(
        <FilesTable
          files={testFiles}
          paginationInfo={paginationInfo}
          isLoading={false}
          filesTotalDownloadSize={testFilesTotalDownloadSize}
          criteria={defaultCriteria}
          fileRepository={fileRepository}
          datasetRepository={datasetRepository}
        />
      )
      cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()

      cy.get('table > tbody > tr:nth-child(2)').should('have.class', styles['selected-row'])
    })
  })

  it('renders the zip download limit message when the zip download limit is reached', () => {
    const testFiles = [
      FilePreviewMother.create({
        metadata: FileMetadataMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) })
      }),
      FilePreviewMother.create({
        metadata: FileMetadataMother.create({ size: new FileSize(2048, FileSizeUnit.BYTES) })
      })
    ]

    const dataverseInfoRepository = {} as DataverseInfoRepository

    dataverseInfoRepository.getZipDownloadLimit = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(new ZipDownloadLimit(500, FileSizeUnit.BYTES)))
    dataverseInfoRepository.getHasPublicStore = cy.stub().resolves({})
    dataverseInfoRepository.getExternalStatusesAllowed = cy.stub().resolves({})
    dataverseInfoRepository.getMaxEmbargoDurationInMonths = cy.stub().resolves({})

    cy.customMount(
      <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
        <FilesTable
          files={testFiles}
          paginationInfo={paginationInfo}
          isLoading={false}
          filesTotalDownloadSize={testFilesTotalDownloadSize}
          criteria={defaultCriteria}
          fileRepository={fileRepository}
          datasetRepository={datasetRepository}
        />
      </SettingsProvider>
    )

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('not.exist')
    cy.get('table > tbody > tr:nth-child(1) > td:nth-child(1) > input[type=checkbox]').click()
    cy.get('table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]').click()

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })

  it('renders the file actions column', () => {
    cy.customMount(
      <FilesTable
        files={testFiles}
        paginationInfo={paginationInfo}
        isLoading={false}
        filesTotalDownloadSize={testFilesTotalDownloadSize}
        criteria={defaultCriteria}
        fileRepository={fileRepository}
        datasetRepository={datasetRepository}
      />
    )

    cy.findByRole('columnheader', { name: 'File Actions' }).should('exist')
  })

  describe('getCellStyle function', () => {
    it('should return the correct style for status cell', () => {
      const cellId = 'status'
      cy.wrap(getCellStyle(cellId)).should('deep.equal', { borderWidth: '0 1px 0 0' })
    })

    it('should return the correct style for info cell', () => {
      const cellId = 'info'
      cy.wrap(getCellStyle(cellId)).should('deep.equal', { borderWidth: '0 0 0 1px' })
    })

    it('should return undefined for unknown cell', () => {
      const cellId = 'unknown'
      cy.wrap(getCellStyle(cellId)).should('be.undefined')
    })
  })
})
