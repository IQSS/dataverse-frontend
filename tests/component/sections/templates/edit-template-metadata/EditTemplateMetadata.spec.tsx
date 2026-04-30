import { ReadError } from '@iqss/dataverse-client-javascript'
import { EditTemplateMetadata } from '@/sections/templates/edit-template-metadata/EditTemplateMetadata'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { MetadataBlockInfoRepository } from '@/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { TemplateRepository } from '@/templates/domain/repositories/TemplateRepository'
import { CollectionMother } from '../../../collection/domain/models/CollectionMother'
import { MetadataBlockInfoMother } from '../../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { TemplateMother } from '../TemplateMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository
const templateRepository: TemplateRepository = {} as TemplateRepository

const collection = CollectionMother.create({ name: 'Root', id: 'root' })
const collectionMetadataBlocksInfo =
  MetadataBlockInfoMother.getByCollectionIdDisplayedOnCreateTrue()

const template = TemplateMother.create({ id: 1, name: 'Existing Template' })

describe('EditTemplateMetadata', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
    metadataBlockInfoRepository.getByCollectionId = cy.stub().resolves(collectionMetadataBlocksInfo)
    templateRepository.getTemplate = cy.stub().resolves(template)
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])
  })

  const mountEditTemplateMetadata = () =>
    cy.customMount(
      <EditTemplateMetadata
        collectionId="root"
        templateId={1}
        collectionRepository={collectionRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        templateRepository={templateRepository}
      />
    )

  it('shows page not found when the owner collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)

    mountEditTemplateMetadata()

    cy.findByTestId('not-found-page').should('exist')
  })

  it('shows the loading skeleton while loading', () => {
    const delayedTime = 200
    templateRepository.getTemplate = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(delayedTime).then(() => template)
    })

    mountEditTemplateMetadata()

    cy.clock()
    cy.findByTestId('edit-template-metadata-skeleton').should('exist')

    cy.tick(delayedTime)
    cy.findByTestId('edit-template-metadata-skeleton').should('not.exist')
  })

  it('renders the page title and breadcrumb', () => {
    mountEditTemplateMetadata()

    cy.findByRole('heading', { name: /Edit Template Metadata/i }).should('exist')
    cy.findByRole('link', { name: /Dataset Templates/i }).should('exist')
  })

  it('pre-fills the template name with the existing value', () => {
    mountEditTemplateMetadata()

    cy.findByLabelText(/Template Name/).should('have.value', 'Existing Template')
  })

  it('renders Save Changes and Cancel buttons', () => {
    mountEditTemplateMetadata()

    cy.findByRole('button', { name: 'Save Changes' }).should('exist')
    cy.findByRole('button', { name: 'Cancel' }).should('exist')
  })

  it('shows an error message when the template fails to load', () => {
    templateRepository.getTemplate = cy.stub().rejects(new ReadError('Template fetch boom'))

    mountEditTemplateMetadata()

    cy.findByText(/Template fetch boom/i).should('exist')
  })

  it('calls updateTemplateMetadata with the edited name', () => {
    templateRepository.updateTemplateMetadata = cy.stub().resolves()

    mountEditTemplateMetadata()

    cy.findByLabelText(/Template Name/)
      .clear()
      .type('Renamed Template')
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.wrap(templateRepository.updateTemplateMetadata).should('have.been.calledOnce')
    cy.wrap(templateRepository.updateTemplateMetadata).then((stub) => {
      const [templateId, payload] = (stub as unknown as sinon.SinonStub).getCall(0).args
      expect(templateId).to.equal(1)
      expect((payload as { name: string }).name).to.equal('Renamed Template')
    })
  })

  it('shows the validation error when the template name is cleared', () => {
    mountEditTemplateMetadata()

    cy.findByLabelText(/Template Name/).clear()
    cy.findByRole('button', { name: 'Save Changes' }).click()

    cy.findAllByText(/Please add in a name for the dataset template./i).should(
      'have.length.at.least',
      1
    )
  })
})
