import { CreateTemplate } from '../../../../../src/sections/templates/create-template/CreateTemplate'
import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '../../../../../src/templates/domain/repositories/TemplateRepository'
import { RouteWithParams } from '../../../../../src/sections/Route.enum'
import { CollectionMother } from '../../../collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UpwardHierarchyNodeMother } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const templateRepository: TemplateRepository = {} as TemplateRepository

const root = UpwardHierarchyNodeMother.createCollection({ name: 'Root', id: 'root' })
const subcollection = UpwardHierarchyNodeMother.createCollection({
  name: 'Subcollection',
  id: 'subcollection',
  parent: root
})
const dataset = UpwardHierarchyNodeMother.createDataset({
  name: 'Dataset',
  id: 'dataset-id',
  persistentId: 'doi:10.5072/FK2/ABC123',
  version: 'DRAFT',
  parent: subcollection
})

const collection = CollectionMother.create({
  name: 'Current Collection',
  id: 'root',
  hierarchy: dataset
})
const collectionMetadataBlocksInfo =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

describe('Create Template', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(collectionMetadataBlocksInfo)
  })

  const mountCreateTemplate = () =>
    cy.customMount(
      <CreateTemplate
        collectionId="root"
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        templateRepository={templateRepository}
      />
    )

  it('should show page not found when owner collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)

    mountCreateTemplate()

    cy.findByTestId('not-found-page').should('exist')
  })

  it('should show loading skeleton while loading the collection', () => {
    const delayedTime = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(delayedTime).then(() => collection)
    })

    mountCreateTemplate()

    cy.clock()
    cy.findByTestId('create-template-skeleton').should('exist')

    cy.tick(delayedTime)
    cy.findByTestId('create-template-skeleton').should('not.exist')
  })

  it('should render custom instructions toggle for template fields', () => {
    mountCreateTemplate()

    cy.findByTestId('custom-instructions-toggle-title').should('exist')
  })

  it('renders the breadcrumb trail, heading, and create form', () => {
    mountCreateTemplate()

    cy.findByRole('link', { name: 'Root' }).should('have.attr', 'href', '/collections')
    cy.findByRole('link', { name: 'Subcollection' }).should(
      'have.attr',
      'href',
      '/collections/subcollection'
    )
    cy.findByRole('link', { name: 'Dataset' }).should(
      'have.attr',
      'href',
      '/datasets?persistentId=doi:10.5072/FK2/ABC123&version=DRAFT'
    )
    cy.findByRole('link', { name: 'Dataset Templates' }).should(
      'have.attr',
      'href',
      RouteWithParams.COLLECTION_TEMPLATES('root')
    )
    cy.findByLabelText(/Template Name/).should('exist')
    cy.findByRole('button', { name: 'Save + Add Terms' }).should('exist')
  })

  it('should render asterisks tips under template name', () => {
    mountCreateTemplate()

    cy.findByText(
      'Asterisks indicate metadata fields that users will be required to fill out while adding a dataset to this dataverse.'
    ).should('exist')
    cy.findByText('Asterisks indicate required fields').should('exist')
  })
})
