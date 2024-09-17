import { CreateDataset } from '../../../../src/sections/create-dataset/CreateDataset'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { NotImplementedModalProvider } from '../../../../src/sections/not-implemented/NotImplementedModalProvider'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const collectionRepository: CollectionRepository = {} as CollectionRepository
const userPermissionsMock = CollectionMother.createUserPermissions()

const collectionMetadataBlocksInfo =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

const COLLECTION_NAME = 'Collection Name'
const collection = CollectionMother.create({ name: COLLECTION_NAME })

describe('Create Dataset', () => {
  beforeEach(() => {
    datasetRepository.create = cy.stub().resolves({ persistentId: 'persistentId' })
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(collectionMetadataBlocksInfo)

    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)
    collectionRepository.getById = cy.stub().resolves(collection)
  })

  it('should show page not found when owner collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)
    cy.customMount(
      <CreateDataset
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />
    )
    cy.findByText('Page Not Found').should('exist')
  })

  it('should show loading skeleton while loading the collection', () => {
    cy.customMount(
      <CreateDataset
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />
    )
    cy.findByTestId('create-dataset-skeleton').should('exist')
  })

  it('should render the correct breadcrumbs', () => {
    cy.customMount(
      <CreateDataset
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Create Dataset')
      .should('have.class', 'active')
  })

  it('renders the Host Collection Form for root collection', () => {
    cy.customMount(
      <CreateDataset
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />
    )
    cy.findByText(/^Host Collection/i).should('exist')
    cy.findByDisplayValue('root').should('exist')
  })

  it('renders the Host Collection Form', () => {
    cy.customMount(
      <NotImplementedModalProvider>
        <CreateDataset
          datasetRepository={datasetRepository}
          collectionId={'test-collectionId'}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionRepository={collectionRepository}
        />
      </NotImplementedModalProvider>
    )
    cy.findByText(/^Host Collection/i).should('exist')
    cy.findByDisplayValue('test-collectionId').should('exist')
    cy.findByText(/^Edit Host Collection/i)
      .should('exist')
      .click()
      .then(() => {
        cy.findByText('Not Implemented').should('exist')
      })
  })

  it('should show alert error message when user is not allowed to create a dataset within the collection', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(
      CollectionMother.createUserPermissions({
        canAddDataset: false
      })
    )

    cy.customMount(
      <CreateDataset
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-dataset-alert').should('exist')
  })

  it('should not show alert error message when user is allowed to create a dataset within the collection', () => {
    cy.customMount(
      <CreateDataset
        datasetRepository={datasetRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionRepository={collectionRepository}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-dataset-alert').should('not.exist')
  })
})
