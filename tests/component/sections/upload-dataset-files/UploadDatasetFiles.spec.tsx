import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { FileRepository } from '../../../../src/files/domain/repositories/FileRepository'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { ReactNode } from 'react'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { UploadDatasetFiles } from '../../../../src/sections/upload-dataset-files/UploadDatasetFiles'

const fileRepository: FileRepository = {} as FileRepository
const datasetRepository: DatasetRepository = {} as DatasetRepository

describe('Dataset', () => {
  const mountWithDataset = (
    component: ReactNode,
    dataset: DatasetModel | undefined,
    timeout = 0
  ) => {
    const searchParams = { persistentId: 'some-persistent-id' }
    datasetRepository.getByPersistentId = cy
      .stub()
      .resolves(new Promise((resolve) => setTimeout(() => resolve(dataset), timeout)))
    cy.customMount(
      <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
        {component}
      </DatasetProvider>
    )
  }

  it('renders skeleton while loading', () => {
    const testDataset = DatasetMother.create()

    // wait for a timeout before resolving the promise, in order to test the rendering of the skeleton
    mountWithDataset(<UploadDatasetFiles fileRepository={fileRepository} />, testDataset, 1000)

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
})
