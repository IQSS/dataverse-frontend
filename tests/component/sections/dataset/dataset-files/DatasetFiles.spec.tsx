import { FileMother } from '../../../files/domain/models/FileMother'
import { DatasetFiles } from '../../../../../src/sections/dataset/dataset-files/DatasetFiles'
import { FileRepository } from '../../../../../src/files/domain/repositories/FileRepository'

const testFiles = FileMother.createMany(10)
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

    testFiles.forEach((file) => {
      cy.findByText(file.name).should('exist')
    })
  })
})
