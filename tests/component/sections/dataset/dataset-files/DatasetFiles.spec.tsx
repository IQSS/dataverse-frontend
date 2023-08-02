import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetFiles } from '../../../../../src/sections/dataset/dataset-files/DatasetFiles'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'
import {
  FileAccessOption,
  FileCriteria,
  FileSortByOption
} from '../../../../../src/files/domain/models/FileCriteria'
import { FilesCountInfoMother } from '../../../files/domain/models/FilesCountInfoMother'
import { FilePaginationInfo } from '../../../../../src/files/domain/models/FilePaginationInfo'

const testFiles = FileMother.createMany(200)
const datasetPersistentId = 'test-dataset-persistent-id'
const datasetVersion = 'test-dataset-version'
const fileRepository: FileRepository = {} as FileRepository
const testFilesCountInfo = FilesCountInfoMother.create({ total: 200 })
describe('DatasetFiles', () => {
  beforeEach(() => {
    fileRepository.getAllByDatasetPersistentId = cy.stub().resolves(testFiles)
    fileRepository.getCountInfoByDatasetPersistentId = cy.stub().resolves(testFilesCountInfo)
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

    cy.wrap(fileRepository.getCountInfoByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion
    )
  })

  it('calls the useFiles hook with the correct parameters when sortBy criteria changes', () => {
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
  })

  it('calls the useFiles hook with the correct parameters when filterByType criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: 'Filter Type: All' }).click()
    cy.findByText('Image (485)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withFilterByType('image')
    )
  })

  it('calls the useFiles hook with the correct parameters when filterByAccess criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: 'Access: All' }).click()
    cy.findByText('Public (222)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withFilterByAccess(FileAccessOption.PUBLIC)
    )
  })

  it('calls the useFiles hook with the correct parameters when filterByTag criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: 'Filter Tag: All' }).click()
    cy.findByText('Document (5)').should('exist').click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withFilterByTag('document')
    )
  })

  it('calls the useFiles hook with the correct parameters when searchText criteria changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByLabelText('Search').type('test{enter}')
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FileCriteria().withSearchText('test')
    )
  })

  it('calls the useFiles hook with the correct parameters when paginationInfo changes', () => {
    cy.customMount(
      <DatasetFiles
        filesRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        datasetVersion={datasetVersion}
      />
    )

    cy.findByRole('button', { name: '5' }).click()
    cy.wrap(fileRepository.getAllByDatasetPersistentId).should(
      'be.calledWith',
      datasetPersistentId,
      datasetVersion,
      new FilePaginationInfo(5, 10, 200)
    )
  })
})
