import { DatasetTemplates } from '../../../../src/sections/templates/DatasetTemplates'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '../../../../src/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { DatasetTemplateMother } from '../../dataset/domain/models/DatasetTemplateMother'
import { NotImplementedModalProvider } from '../../../../src/sections/not-implemented/NotImplementedModalProvider'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const templateRepository: TemplateRepository = {} as TemplateRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const collection = CollectionMother.create({ name: 'Root', id: 'root' })
const [templateAlpha, templateBeta, templateGamma] = DatasetTemplateMother.createTemplates([
  { id: 1, name: 'Alpha', isDefault: false, usageCount: 2, createDate: 'Sep 1, 2025' },
  { id: 2, name: 'Beta', isDefault: true, usageCount: 10, createDate: 'Sep 3, 2025' },
  { id: 3, name: 'Gamma', isDefault: false, usageCount: 5, createDate: 'Sep 2, 2025' }
])

describe('Dataset Templates', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([])
  })

  const mountDatasetTemplates = () =>
    cy.customMount(
      <NotImplementedModalProvider>
        <DatasetTemplates
          collectionRepository={collectionRepository}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionIdFromParams="root"
        />
      </NotImplementedModalProvider>
    )

  it('shows the empty state when there are no templates', () => {
    mountDatasetTemplates()

    cy.findByRole('heading', { name: 'Why Use Templates?' }).should('exist')
    cy.findByRole('heading', { name: 'How To Use Templates?' }).should('exist')
    cy.findByRole('table').should('not.exist')
  })

  it('renders the info alert and templates table when templates exist', () => {
    const template = DatasetTemplateMother.create({
      name: 'Template A',
      isDefault: false,
      createDate: 'Sep 2, 2025',
      usageCount: 4
    })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])

    mountDatasetTemplates()

    cy.findByRole('button', { name: 'Create Dataset Template' }).should('exist')
    cy.findByText('Manage Dataset Templates').should('exist')
    cy.findByRole('table').within(() => {
      cy.findByText('Template Name').should('exist')
      cy.findByText('Date Created').should('exist')
      cy.findByText('Usage').should('exist')
      cy.findByText('Action').should('exist')
    })
  })

  it('shows Default as disabled and hides Make Default for the default template', () => {
    const [templateDefault, templateOther] = DatasetTemplateMother.createTemplates([
      { id: 1, name: 'Template Default', isDefault: true },
      { id: 2, name: 'Template Other', isDefault: false }
    ])
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .resolves([templateDefault, templateOther])

    mountDatasetTemplates()

    cy.findByText('Template Default')
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: 'Default' }).should('be.disabled')
        cy.findByRole('button', { name: 'Make Default' }).should('not.exist')
      })
  })

  it('shows Metadata and Terms in the edit dropdown', () => {
    const template = DatasetTemplateMother.create({
      id: 1,
      name: 'Template Edit',
      isDefault: false
    })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])

    mountDatasetTemplates()

    cy.findByRole('button', { name: 'Edit Template' }).click({ force: true })
    cy.findByText('Metadata').should('exist')
    cy.findByText('Terms').should('exist')
  })

  it('deletes a template from the list', () => {
    const template = DatasetTemplateMother.create({
      id: 1,
      name: 'Template To Delete',
      isDefault: false
    })
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .onFirstCall()
      .resolves([template])
      .onSecondCall()
      .resolves([])
    templateRepository.deleteTemplate = cy.stub().resolves()

    mountDatasetTemplates()

    cy.findByRole('button', { name: 'Delete' }).click({ force: true })
    cy.findByRole('dialog').within(() => {
      cy.findByText('Delete Template').should('exist')
      cy.findByRole('button', { name: 'Delete' }).click({ force: true })
    })

    cy.wrap(templateRepository.deleteTemplate).should('have.been.calledWith', template.id)
    cy.findByRole('heading', { name: 'Why Use Templates?' }).should('exist')
  })

  it('opens the template preview modal', () => {
    const template = DatasetTemplateMother.create({
      id: 1,
      name: 'Template Preview',
      isDefault: false
    })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])
    templateRepository.getTemplate = cy.stub().resolves(template)
    metadataBlockInfoRepository.getByName = cy.stub().resolves(MetadataBlockInfoMother.create())

    mountDatasetTemplates()

    cy.findByRole('button', { name: 'View' }).click({ force: true })
    cy.findByRole('dialog').within(() => {
      cy.findByText('Dataset Template Preview').should('exist')
      cy.findByText('No citation metadata is available for this template.').should('exist')
    })
  })

  it('sorts templates by name and toggles direction', () => {
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .resolves([templateGamma, templateAlpha, templateBeta])

    mountDatasetTemplates()

    const getTableNames = () =>
      cy
        .findByRole('table')
        .find('tbody tr')
        .then(($rows) =>
          $rows
            .get()
            .filter((row): row is HTMLTableRowElement => row instanceof HTMLTableRowElement)
            .map((row) => row.cells.item(0)?.textContent?.trim() ?? '')
        )

    getTableNames().should('deep.equal', ['Gamma', 'Alpha', 'Beta'])

    cy.findByRole('button', { name: 'Template Name' }).click()
    getTableNames().should('deep.equal', ['Alpha', 'Beta', 'Gamma'])

    cy.findByRole('button', { name: 'Template Name' }).click()
    getTableNames().should('deep.equal', ['Gamma', 'Beta', 'Alpha'])
  })

  it('sorts templates by date descending', () => {
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .resolves([templateAlpha, templateBeta, templateGamma])

    mountDatasetTemplates()

    const getTableDates = () =>
      cy
        .findByRole('table')
        .find('tbody td:nth-child(2)')
        .then((cells) => Cypress._.map(cells, (cell) => cell.textContent?.trim()))

    cy.findByRole('button', { name: 'Date Created' }).click()
    cy.findByRole('button', { name: 'Date Created' }).click()
    getTableDates().should('deep.equal', ['Sep 3, 2025', 'Sep 2, 2025', 'Sep 1, 2025'])
  })

  it('sorts templates by usage descending', () => {
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .resolves([templateAlpha, templateBeta, templateGamma])

    mountDatasetTemplates()

    const getTableUsage = () =>
      cy
        .findByRole('table')
        .find('tbody td:nth-child(3)')
        .then((cells) => Cypress._.map(cells, (cell) => cell.textContent?.trim()))

    cy.findByRole('button', { name: 'Usage' }).click()
    cy.findByRole('button', { name: 'Usage' }).click()
    getTableUsage().should('deep.equal', ['10', '5', '2'])
  })
})
