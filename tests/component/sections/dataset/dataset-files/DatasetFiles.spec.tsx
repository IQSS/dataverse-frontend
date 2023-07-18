import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetFiles } from '../../../../../src/sections/dataset/dataset-files/DatasetFiles'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import { FileCriteria, FileSortByOption } from '../../../../../src/files/domain/models/FileCriteria'
import styles from '../../../../../src/sections/dataset/dataset-files/files-table/FilesTable.module.scss'
import { FileSize, FileSizeUnit } from '../../../../../src/files/domain/models/File'
import { SettingsContext } from '../../../../../src/sections/settings/SettingsContext'
import { SettingMother } from '../../../settings/domain/models/SettingMother'
import { ZipDownloadLimit } from '../../../../../src/settings/domain/models/ZipDownloadLimit'

const testFiles = FileMother.createMany(200)
const datasetPersistentId = 'test-dataset-persistent-id'
const datasetVersion = 'test-dataset-version'
const fileRepository: FileRepository = {} as FileRepository
describe('DatasetFiles', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves(testFiles)
  })

  it('renders the files table', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('table').should('exist')
    cy.findByRole('columnheader', { name: /Files/ }).should('exist')
    cy.get('table > thead > tr > th:nth-child(1) > input[type="checkbox"]').should('exist')

    testFiles.slice(0, 10).forEach((file) => {
      cy.findByText(file.name).should('exist')
    })
  })

  it('renders the files table with the correct header on a page different than the first one ', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: '6' }).click()

    cy.findByRole('columnheader', { name: '51 to 60 of 200 Files' }).should('exist')
  })

  it('renders the files table with the correct header with a different page size ', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByLabelText('Files per page').select('50')
    cy.findByRole('button', { name: '3' }).click()

    cy.findByRole('columnheader', { name: '101 to 150 of 200 Files' }).should('exist')
  })

  it('renders the no files message when there are no files', () => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves([])

    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByText('There are no files in this dataset.').should('exist')
  })

  it('calls the useFiles hook with the correct parameters', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion
    )
  })

  it('calls the useFiles hook with the correct parameters when criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByText('Name (A-Z)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withSortBy(FileSortByOption.NAME_AZ)
    )

    cy.findByRole('button', { name: 'Filter Type: All' }).should('exist')
  })

  // TODO (filesCountInfo) - Implement getFilesCountInfo in the FileRepository to pass this test
  it.skip('does not render the files criteria inputs when there are less than 2 files', () => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves(FileMother.createMany(1))

    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: /Sort/ }).should('not.exist')
    cy.findByRole('button', { name: 'Filter Type: All' }).should('not.exist')
  })

  it("selects all rows when the 'Select all' button is clicked", () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.get(
      'body > div > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]'
    ).click()

    cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()

    cy.findByText('200 files are currently selected.').should('exist')

    cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).should('not.exist')
  })

  it('clears the selection when the clear selection button is clicked', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.get(
      'body > div > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]'
    ).click()

    cy.findByRole('button', { name: 'Select all 200 files in this dataset.' }).click()

    cy.findByText('200 files are currently selected.').should('exist')

    cy.findByRole('button', { name: 'Clear selection.' }).click()

    cy.findByText(/files are currently selected./).should('not.exist')
  })

  it('highlights the selected rows', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )
    cy.get(
      'body > div > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]'
    ).click()

    cy.get('body > div > div:nth-child(2) > table > tbody > tr:nth-child(2)').should(
      'have.class',
      styles['selected-row']
    )
  })

  it('renders the zip download limit message when the zip download limit is reached', () => {
    const testFiles = [
      FileMother.create({ size: new FileSize(1024, FileSizeUnit.BYTES) }),
      FileMother.create({ size: new FileSize(2048, FileSizeUnit.BYTES) })
    ]
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves(testFiles)
    const getSettingByName = cy
      .stub()
      .resolves(SettingMother.createZipDownloadLimit(new ZipDownloadLimit(500, FileSizeUnit.BYTES)))

    cy.customMount(
      <SettingsContext.Provider value={{ getSettingByName }}>
        <DatasetFiles
          filesRepository={fileRepository}
          datasetPersistentId={datasetPersistentId}
          datasetVersion={datasetVersion}
        />
      </SettingsContext.Provider>
    )

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('not.exist')
    cy.get(
      'body > div > div:nth-child(2) > table > tbody > tr:nth-child(1) > td:nth-child(1) > input[type=checkbox]'
    ).click()
    cy.get(
      'body > div > div:nth-child(2) > table > tbody > tr:nth-child(2) > td:nth-child(1) > input[type=checkbox]'
    ).click()

    cy.findByText(
      'The overall size of the files selected (3.0 KB) for download exceeds the zip limit of 500.0 B. Please unselect some files to continue.'
    ).should('exist')
  })
})
