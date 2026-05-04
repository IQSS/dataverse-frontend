import { CreateDataset } from '../../../../src/sections/create-dataset/CreateDataset'
import { DatasetRepository } from '../../../../src/dataset/domain/repositories/DatasetRepository'
import { TemplateRepository } from '../../../../src/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { NotImplementedModalProvider } from '../../../../src/sections/not-implemented/NotImplementedModalProvider'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { DatasetTemplateMother } from '@tests/component/dataset/domain/models/DatasetTemplateMother'
import { WithRepositories } from '@tests/component/WithRepositories'

const datasetRepository: DatasetRepository = {} as DatasetRepository
const templateRepository: TemplateRepository = {} as TemplateRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const collectionRepository: CollectionRepository = {} as CollectionRepository
const userPermissionsMock = CollectionMother.createUserPermissions()

const collectionMetadataBlocksInfo =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

const metadataBlocksInfoOnEditMode =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateFalse()

const COLLECTION_NAME = 'Collection Name'
const collection = CollectionMother.create({ name: COLLECTION_NAME, id: 'test-alias' })

const mountCreateDataset = (component: JSX.Element): void => {
  cy.customMount(
    <WithRepositories collectionRepository={collectionRepository}>{component}</WithRepositories>
  )
}

describe('Create Dataset', () => {
  beforeEach(() => {
    datasetRepository.create = cy.stub().resolves({ persistentId: 'persistentId' })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([])
    metadataBlockInfoRepository.getDisplayedOnCreateByCollectionId = cy
      .stub()
      .resolves(collectionMetadataBlocksInfo)

    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(metadataBlocksInfoOnEditMode)

    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)
    collectionRepository.getById = cy.stub().resolves(collection)
  })

  it('should show page not found when owner collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)
    mountCreateDataset(
      <CreateDataset
        datasetRepository={datasetRepository}
        templateRepository={templateRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionId={'non-existing-collection'}
      />
    )
    cy.findByTestId('not-found-page').should('exist')
  })

  it('should show loading skeleton while loading the collection', () => {
    const DELAYED_TIME = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => collection)
    })

    mountCreateDataset(
      <CreateDataset
        datasetRepository={datasetRepository}
        templateRepository={templateRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionId={'test-collectionId'}
      />
    )
    cy.clock()
    cy.findByTestId('create-dataset-skeleton').should('exist')

    cy.tick(DELAYED_TIME)
    cy.findByTestId('create-dataset-skeleton').should('not.exist')
  })

  it('should render the correct breadcrumbs', () => {
    mountCreateDataset(
      <CreateDataset
        datasetRepository={datasetRepository}
        templateRepository={templateRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionId={'test-collectionId'}
      />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Create Dataset')
      .should('have.class', 'active')
  })

  it('renders the Host Collection Form', () => {
    mountCreateDataset(
      <NotImplementedModalProvider>
        <CreateDataset
          datasetRepository={datasetRepository}
          collectionId={'test-collectionId'}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
        />
      </NotImplementedModalProvider>
    )
    cy.findByText(/^Host Collection/i).should('exist')
    cy.findByDisplayValue('test-alias').should('exist')
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

    mountCreateDataset(
      <CreateDataset
        datasetRepository={datasetRepository}
        templateRepository={templateRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionId={'test-collectionId'}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-dataset-alert').should('exist')
  })

  it('should not show alert error message when user is allowed to create a dataset within the collection', () => {
    mountCreateDataset(
      <CreateDataset
        datasetRepository={datasetRepository}
        templateRepository={templateRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        collectionId={'test-collectionId'}
      />
    )
    cy.findAllByTestId('not-allowed-to-create-dataset-alert').should('not.exist')
  })

  describe('dataset templates functionality', () => {
    it('should not show template select when there are no templates', () => {
      mountCreateDataset(
        <CreateDataset
          datasetRepository={datasetRepository}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionId={'test-collectionId'}
        />
      )
      cy.findByTestId('dataset-template-select').should('not.exist')
    })

    it('should show template select when there are templates', () => {
      const testDatasetTemplate1 = DatasetTemplateMother.create({
        name: 'Template 1',
        isDefault: false
      })
      templateRepository.getTemplatesByCollectionId = cy.stub().resolves([testDatasetTemplate1])

      mountCreateDataset(
        <CreateDataset
          datasetRepository={datasetRepository}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionId={'test-collectionId'}
        />
      )
      cy.findByTestId('dataset-template-select').should('exist')

      cy.findByText('None').should('exist') // No default template
    })

    it('should set default template when there is one', () => {
      const testDatasetTemplate1 = DatasetTemplateMother.create({
        name: 'Template 1',
        isDefault: false
      })
      const testDatasetTemplate2 = DatasetTemplateMother.create({
        name: 'Template 2',
        isDefault: true
      })
      templateRepository.getTemplatesByCollectionId = cy
        .stub()
        .resolves([testDatasetTemplate1, testDatasetTemplate2])

      mountCreateDataset(
        <CreateDataset
          datasetRepository={datasetRepository}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionId={'test-collectionId'}
        />
      )
      cy.findByTestId('dataset-template-select').should('exist')
      cy.findByText('None').should('not.exist')
      cy.findByText('Template 2').should('exist') // Default template
    })

    it('should change template when user selects another one', () => {
      const testDatasetTemplate1 = DatasetTemplateMother.create({
        name: 'Template 1',
        isDefault: false
      })
      const testDatasetTemplate2 = DatasetTemplateMother.create({
        name: 'Template 2',
        isDefault: false
      })
      templateRepository.getTemplatesByCollectionId = cy
        .stub()
        .resolves([testDatasetTemplate1, testDatasetTemplate2])

      mountCreateDataset(
        <CreateDataset
          datasetRepository={datasetRepository}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionId={'test-collectionId'}
        />
      )
      cy.findByTestId('dataset-template-select').should('exist').as('templateSelect')
      cy.findByText('None').should('exist') // No default template, None is shown

      cy.get('@templateSelect').within(() => {
        cy.findByLabelText('Toggle options menu').click()
        cy.findByText('Template 2').click()
      })

      cy.findAllByText('Template 2').should('exist').should('have.length', 2) // Template 2 is selected, we see two
    })
  })
})
