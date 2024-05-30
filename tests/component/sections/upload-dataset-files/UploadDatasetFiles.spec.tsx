import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { UploadDatasetFiles } from '../../../../src/sections/upload-dataset-files/UploadDatasetFiles'
import { FileMockLoadingRepository } from '../../../../src/stories/file/FileMockLoadingRepository'

const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('Dataset', () => {
  const mountWithDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    const searchParams = { persistentId: 'some-persistent-id' }
    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)

    cy.customMount(
      <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
        {component}
      </DatasetProvider>
    )
  }

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.findByText('Temporary Loading until having shape of skeleton').should('exist')
    cy.findByText(testDataset.version.title).should('not.exist')
  })

  it('renders page not found when dataset is null', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, emptyDataset)

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the breadcrumbs', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset)

    cy.findByText('Dataset Title').should('exist').should('have.class', 'active')
    cy.findByRole('link', { name: 'Root' }).should('exist')
  })

  it('renders the file uploader', () => {
    const testDataset = DatasetMother.create()

    mountWithDataset(
      <UploadDatasetFiles fileRepository={new FileMockLoadingRepository()} />,
      testDataset
    )

    cy.findByText('Select Files to Add').should('exist')
    cy.findByText('Drag and drop files here.').should('exist')
    cy.findByText('Drag and drop files here.').selectFile(
      {
        fileName: 'users.json',
        contents: [{ name: 'John Doe' }]
      },
      { action: 'drag-drop' }
    )
    cy.findByText('users.json').should('exist')
  })
})
