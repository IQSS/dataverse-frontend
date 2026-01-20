import { CreateTemplate } from '../../../../../src/sections/templates/create-template'
import { CollectionRepository } from '../../../../../src/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '../../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '../../../../../src/templates/domain/repositories/TemplateRepository'
import { CollectionMother } from '../../../collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const templateRepository: TemplateRepository = {} as TemplateRepository

const collection = CollectionMother.create({ name: 'Root', id: 'root' })
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

  it('should render breadcrumbs correctly', () => {
    mountCreateTemplate()

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.findByRole('link', { name: 'Root' })
      .closest('.breadcrumb')
      .within(() => {
        cy.findByText('Dataset Templates').should('exist')
        cy.findByText('Create').should('exist')
      })
  })
})
