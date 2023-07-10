import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetFiles } from '../../../../../src/sections/dataset/dataset-files/DatasetFiles'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'

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
      { orderBy: 'name_az' }
    )
  })
})
