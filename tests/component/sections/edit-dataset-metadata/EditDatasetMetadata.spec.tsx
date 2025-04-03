import { ReactNode } from 'react'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../dataset/domain/models/DatasetMother'
import { LoadingProvider } from '../../../../src/sections/loading/LoadingProvider'
import { Dataset as DatasetModel } from '../../../../src/dataset/domain/models/Dataset'
import { DatasetProvider } from '../../../../src/sections/dataset/DatasetProvider'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { EditDatasetMetadata } from '../../../../src/sections/edit-dataset-metadata/EditDatasetMetadata'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const dataset = DatasetMother.createRealistic()
const metadataBlocksInfoOnEditMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse()

describe('EditDatasetMetadata', () => {
  const mountWithDataset = (component: ReactNode, dataset: DatasetModel | undefined) => {
    const searchParams = { persistentId: 'some-persistent-id' }

    datasetRepository.getByPersistentId = cy.stub().resolves(dataset)
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(metadataBlocksInfoOnEditMode)
    datasetRepository.updateMetadata = cy.stub().resolves(undefined)
    datasetRepository.getDatasetVersionsSummaries = cy.stub().resolves(undefined)
    console.log('datasetRepository', datasetRepository.getDatasetVersionsSummaries)
    cy.customMount(
      <LoadingProvider>
        <DatasetProvider repository={datasetRepository} searchParams={searchParams}>
          {component}
        </DatasetProvider>
      </LoadingProvider>
    )
  }

  it('renders the correct breadcrumbs', () => {
    mountWithDataset(
      <EditDatasetMetadata
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />,
      dataset
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.findByRole('link', { name: 'Root' })
      .closest('.breadcrumb')
      .within(() => {
        cy.findByRole('link', { name: 'Dataset Title' }).should('exist')
        cy.findByText('Edit Dataset Metadata').should('exist')
      })
  })

  it('renders skeleton while loading', () => {
    mountWithDataset(
      <EditDatasetMetadata
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />,
      dataset
    )

    cy.findByTestId('edit-dataset-metadata-skeleton').should('exist')
  })

  it('renders the not found page when dataset is not founded', () => {
    const emptyDataset = DatasetMother.createEmpty()

    mountWithDataset(
      <EditDatasetMetadata
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />,
      emptyDataset
    )

    cy.findByTestId('not-found-page').should('exist')
  })

  it('renders the Host Collection', () => {
    mountWithDataset(
      <EditDatasetMetadata
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
      />,
      dataset
    )

    cy.findByTestId('edit-dataset-metadata-skeleton').should('not.exist')
    cy.findByText(/^Host Collection/i).should('exist')
    cy.findByDisplayValue('Root').should('exist').should('have.attr', 'readonly', 'readonly')
  })
})
