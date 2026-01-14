import { CreateTemplate } from '../../../../src/sections/templates/create-template'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '../../../../src/templates/domain/repositories/TemplateRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
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

  it('should show error message if there is no Template Name', () => {
    mountCreateTemplate()

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.findByText('Please add in a name for the dataset template.').should('exist')
  })

  it('should show error message if there is no required information', () => {
    mountCreateTemplate()

    cy.findByLabelText(/Template Name/).type('Test Template')
    cy.findByRole('button', { name: 'Save + Add Terms' }).click()

    cy.findByText('Title is required').should('exist')
    cy.findByText('Author Name is required').should('exist')
    cy.findByText('Point of Contact E-mail is required').should('exist')
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
