import { DatasetTemplates } from '../../../../src/sections/templates/DatasetTemplates'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { TemplateRepository } from '../../../../src/templates/domain/repositories/TemplateRepository'
import { MetadataBlockInfoRepository } from '../../../../src/metadata-block-info/domain/repositories/MetadataBlockInfoRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'
import { TemplateMother } from './TemplateMother'
import { NotImplementedModalProvider } from '../../../../src/sections/not-implemented/NotImplementedModalProvider'
import { MetadataBlockInfoMother } from '../../metadata-block-info/domain/models/MetadataBlockInfoMother'
import { UpwardHierarchyNodeMother } from '../../shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const templateRepository: TemplateRepository = {} as TemplateRepository
const metadataBlockInfoRepository: MetadataBlockInfoRepository = {} as MetadataBlockInfoRepository

const collection = CollectionMother.create({
  name: 'Scientific Research',
  id: 'sci-research',
  hierarchy: UpwardHierarchyNodeMother.createSubCollection({
    name: 'Scientific Research',
    id: 'root'
  })
})

const [templateAlpha, templateBeta, templateGamma] = TemplateMother.createTemplates([
  { id: 1, name: 'Alpha', isDefault: false, usageCount: 2, createDate: 'Sep 1, 2025' },
  { id: 2, name: 'Beta', isDefault: true, usageCount: 10, createDate: 'Sep 3, 2025' },
  { id: 3, name: 'Gamma', isDefault: false, usageCount: 5, createDate: 'Sep 2, 2025' }
])

const template = TemplateMother.create({
  id: 1,
  name: 'Template',
  isDefault: false
})
describe('Dataset Templates', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
    collectionRepository.getUserPermissions = cy.stub().resolves({
      canAddCollection: false,
      canAddDataset: false,
      canViewUnpublishedCollection: false,
      canEditCollection: true,
      canManageCollectionPermissions: true,
      canPublishCollection: false,
      canDeleteCollection: false
    })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([])
  })

  const mountDatasetTemplates = () =>
    cy.customMount(
      <NotImplementedModalProvider>
        <DatasetTemplates
          collectionRepository={collectionRepository}
          templateRepository={templateRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          collectionId="root"
        />
      </NotImplementedModalProvider>
    )

  it('shows not found when the collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(null)

    mountDatasetTemplates()

    cy.findByTestId('not-found-page').should('exist')
  })

  it('shows loading skeleton while loading data', () => {
    const delayedTime = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(delayedTime).then(() => collection)
    })

    mountDatasetTemplates()

    cy.clock()
    cy.findByTestId('dataset-templates-skeleton').should('exist')

    cy.tick(delayedTime)
    cy.findByTestId('dataset-templates-skeleton').should('not.exist')
  })

  it('shows an error alert when templates fail to load', () => {
    templateRepository.getTemplatesByCollectionId = cy.stub().rejects(new Error('Load failed'))

    mountDatasetTemplates()

    cy.findByText(/Something went wrong getting the dataset templates. Try again later./i).should(
      'exist'
    )
  })

  it('shows the empty state when there are no templates', () => {
    mountDatasetTemplates()

    cy.findByRole('heading', { name: 'Why Use Templates?' }).should('exist')
    cy.findByRole('heading', { name: 'How To Use Templates?' }).should('exist')
    cy.findByRole('table').should('not.exist')
  })

  it('renders the info alert and templates table when templates exist', () => {
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
    const [templateDefault, templateOther] = TemplateMother.createTemplates([
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

  it('hides the edit dropdown when the user cannot edit the collection', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves({
      canAddCollection: false,
      canAddDataset: false,
      canViewUnpublishedCollection: false,
      canEditCollection: false,
      canManageCollectionPermissions: false,
      canPublishCollection: false,
      canDeleteCollection: false
    })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])

    mountDatasetTemplates()

    cy.findByRole('button', { name: 'Edit Template' }).should('not.exist')
  })

  it('hides the edit dropdown for templates from parent collections', () => {
    const otherTemplate = TemplateMother.create({
      name: 'Template From Other',
      collectionAlias: 'other'
    })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([otherTemplate])

    mountDatasetTemplates()

    cy.findByRole('button', { name: 'Edit Template' }).should('not.exist')
  })

  it('shows the template origin when the template comes from another collection', () => {
    const otherTemplate = TemplateMother.create({
      name: 'Template From Other',
      collectionAlias: 'other'
    })
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([otherTemplate])

    mountDatasetTemplates()

    cy.findByText('Template created at other').should('exist')
  })

  it('hides the include templates checkbox at the top-level collection', () => {
    const rootCollection = CollectionMother.create({
      name: 'Root',
      id: 'root',
      hierarchy: UpwardHierarchyNodeMother.createCollection({
        name: 'Root',
        id: 'root'
      })
    })
    collectionRepository.getById = cy.stub().resolves(rootCollection)
    templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])

    mountDatasetTemplates()

    cy.findByLabelText('Include Templates from Root').should('not.exist')
  })

  it('filters out templates from parent collections when unchecked', () => {
    const rootTemplate = TemplateMother.create({
      name: 'Template Root',
      collectionAlias: 'root'
    })
    const otherTemplate = TemplateMother.create({
      name: 'Template From Other',
      collectionAlias: 'other'
    })
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .resolves([rootTemplate, otherTemplate])

    mountDatasetTemplates()

    cy.findByText('Template From Other').should('exist')
    cy.findByLabelText('Include Templates from Root').click()
    cy.findByText('Template Root').should('exist')
    cy.findByText('Template From Other').should('not.exist')
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

  it('resets sorting direction when selecting a different column', () => {
    templateRepository.getTemplatesByCollectionId = cy
      .stub()
      .resolves([templateAlpha, templateBeta, templateGamma])

    mountDatasetTemplates()

    const getTableDates = () =>
      cy
        .findByRole('table')
        .find('tbody td:nth-child(2)')
        .then((cells) => Cypress._.map(cells, (cell) => cell.textContent?.trim()))

    cy.findByRole('button', { name: 'Template Name' }).click()
    cy.findByRole('button', { name: 'Template Name' }).click()
    cy.findByRole('button', { name: 'Date Created' }).click()
    getTableDates().should('deep.equal', ['Sep 1, 2025', 'Sep 2, 2025', 'Sep 3, 2025'])
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

  describe('Edit/Delete actions with edit permission at root', () => {
    beforeEach(() => {
      const rootCollection = CollectionMother.create({
        name: 'Root',
        id: 'root',
        hierarchy: UpwardHierarchyNodeMother.createCollection({
          name: 'Root',
          id: 'root'
        })
      })
      collectionRepository.getById = cy.stub().resolves(rootCollection)
      collectionRepository.getUserPermissions = cy.stub().resolves({
        canAddCollection: false,
        canAddDataset: false,
        canViewUnpublishedCollection: false,
        canEditCollection: true,
        canManageCollectionPermissions: false,
        canPublishCollection: false,
        canDeleteCollection: false
      })

      const rootTemplate = TemplateMother.create({
        name: 'Template Root',
        collectionAlias: 'root'
      })
      templateRepository.getTemplatesByCollectionId = cy.stub().resolves([rootTemplate])

      mountDatasetTemplates()
    })

    it('shows edit and delete buttons for root templates', () => {
      cy.findByRole('button', { name: 'Edit Template' }).should('exist')
      cy.findByRole('button', { name: 'Delete' }).should('exist')
    })

    it('deletes a template from the list', () => {
      templateRepository.deleteTemplate = cy.stub().resolves()

      cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByText('Delete Template').should('exist')
        cy.findByRole('button', { name: 'Delete' }).click()
      })

      cy.findByText(/Template deleted./).should('exist')
    })

    it('keeps the delete modal open while deleting', () => {
      let resolveDelete: (() => void) | undefined
      templateRepository.deleteTemplate = cy.stub().callsFake(
        () =>
          new Promise<void>((resolve) => {
            resolveDelete = resolve
          })
      )
      cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByRole('button', { name: 'Delete' }).click({ force: true })
        cy.findByRole('button', { name: 'Cancel' }).should('be.disabled')
      })

      cy.get('body').type('{esc}', { force: true })
      cy.findByRole('dialog').should('exist')

      cy.then(() => {
        resolveDelete?.()
      })
    })

    it('shows an error message if deletion fails', () => {
      templateRepository.deleteTemplate = cy.stub().rejects(new Error('Deletion failed'))

      cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByText('Delete Template').should('exist')
        cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      })
      cy.findByText(/Something went wrong deleting the template. Try again later./).should('exist')
    })

    it('closes the delete modal and clears the error', () => {
      templateRepository.deleteTemplate = cy.stub().rejects(new Error('Deletion failed'))

      cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      })
      cy.findByText(/Something went wrong deleting the template. Try again later./).should('exist')

      cy.findByRole('button', { name: 'Cancel' }).click({ force: true })
      cy.findByRole('dialog').should('not.exist')

      cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      cy.findByText(/Something went wrong deleting the template. Try again later./).should(
        'not.exist'
      )
    })

    it('does not call delete when the modal is dismissed', () => {
      templateRepository.deleteTemplate = cy.stub().resolves()

      cy.findByRole('button', { name: 'Delete' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByRole('button', { name: 'Cancel' }).click({ force: true })
      })

      cy.wrap(templateRepository.deleteTemplate).should('not.have.been.called')
    })
  })

  describe('Preview Template', () => {
    it('opens the template preview modal', () => {
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

    it('shows citation metadata when the template includes citation fields', () => {
      const templateWithCitation = TemplateMother.create({
        datasetMetadataBlocks: [
          {
            name: 'citation',
            fields: {
              title: 'Test Title'
            }
          }
        ]
      })
      templateRepository.getTemplatesByCollectionId = cy.stub().resolves([templateWithCitation])
      templateRepository.getTemplate = cy.stub().resolves(templateWithCitation)
      metadataBlockInfoRepository.getByName = cy.stub().resolves(MetadataBlockInfoMother.create())

      mountDatasetTemplates()

      cy.findByRole('button', { name: 'View' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByText('Test Title').should('exist')
        cy.findByText('No citation metadata is available for this template.').should('not.exist')
      })
    })

    it('closes the template preview modal', () => {
      templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])
      templateRepository.getTemplate = cy.stub().resolves(template)
      metadataBlockInfoRepository.getByName = cy.stub().resolves(MetadataBlockInfoMother.create())

      mountDatasetTemplates()

      cy.findByRole('button', { name: 'View' }).click()
      cy.findByText('Close').click()
      cy.findByRole('dialog').should('not.exist')
    })

    // write test for citation block useMemo if needed

    //    const citationBlock = useMemo(() => {
    //   if (!template?.datasetMetadataBlocks) return null
    //   return (
    //     template.datasetMetadataBlocks.find((block) => block.name === MetadataBlockName.CITATION) ||
    //     null
    //   )
    // }, [template])
    it('shows loading skeleton while fetching templates', () => {
      templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])
      templateRepository.getTemplate = cy.stub().callsFake(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(template), 100)
          })
      )
      metadataBlockInfoRepository.getByName = cy.stub().resolves(MetadataBlockInfoMother.create())

      mountDatasetTemplates()

      cy.findByRole('button', { name: 'View' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByTestId('preview-modal-skeleton').should('exist')
      })
    })

    it('shows an error message if preview fails', () => {
      templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])
      templateRepository.getTemplate = cy.stub().rejects(new Error('Preview failed'))

      mountDatasetTemplates()

      cy.findByRole('button', { name: 'View' }).click({ force: true })
      cy.findByText(/Something went wrong loading the template preview. Please try again./).should(
        'exist'
      )
    })

    it('shows loading state while fetching preview data', () => {
      templateRepository.getTemplatesByCollectionId = cy.stub().resolves([template])
      templateRepository.getTemplate = cy.stub().callsFake(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(template), 100)
          })
      )

      mountDatasetTemplates()

      cy.findByRole('button', { name: 'View' }).click({ force: true })
      cy.findByRole('dialog').within(() => {
        cy.findByTestId('preview-modal-skeleton').should('exist')
      })
    })
  })
})
