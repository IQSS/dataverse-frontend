import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '@tests/e2e-integration/shared/datasets/DatasetHelper'

const CREATE_TEMPLATE_PAGE_URL = '/spa/root/templates/create'
const TEMPLATES_PAGE_URL = '/spa/root/templates'
const CREATE_DATASET_PAGE_URL = '/spa/datasets/root/create'
describe('Dataset Templates', () => {
  let templateName: string

  beforeEach(() => {
    templateName = `E2E Template ${Date.now()}`

    TestsUtils.login().then((token) => {
      cy.wrap(TestsUtils.setup(token))
    })
  })

  afterEach(() => {
    cy.wrap(null).then(async () => {
      if (!templateName) return
      const templates = await DatasetHelper.getTemplatesByCollectionId()
      const match = templates.find((template) => template.name === templateName)
      if (match) {
        await DatasetHelper.deleteDatasetTemplate(match.id)
      }
    })
  })

  it('creates and previews a template', () => {
    cy.visit(CREATE_TEMPLATE_PAGE_URL)

    cy.findByLabelText(/Template Name/).type(templateName, { force: true })

    cy.findByLabelText(/^Title/i).type('Template Title', { force: true })

    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).type('Test Author', { force: true })
      })

    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^E-mail/i).type('test@example.com', { force: true })
      })

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).type('Template description', { force: true })
      })

    cy.findByText('Subject')
      .closest('.row')
      .within(() => {
        cy.findByLabelText('Toggle options menu').click({ force: true })
        cy.findByLabelText('Agricultural Sciences').click({ force: true })
      })

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.findByText(/Success! Template has been created./i).should('exist')

    cy.findByTestId('cancel-edit-template-terms-button').click()
    cy.url().should('include', TEMPLATES_PAGE_URL)

    cy.findByText(templateName)
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: 'View' }).click({ force: true })
      })

    cy.findByText(/Dataset Template Preview/i).should('exist')
    cy.findByText(/Close/i).click({ force: true })
  })

  it('deletes a template', () => {
    cy.visit(CREATE_TEMPLATE_PAGE_URL)

    cy.findByLabelText(/Template Name/).type(templateName, { force: true })

    cy.findByLabelText(/^Title/i).type('Template Title', { force: true })

    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).type('Test Author', { force: true })
      })

    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^E-mail/i).type('test@example.com', { force: true })
      })

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).type('Template description', { force: true })
      })

    cy.findByText('Subject')
      .closest('.row')
      .within(() => {
        cy.findByLabelText('Toggle options menu').click({ force: true })
        cy.findByLabelText('Agricultural Sciences').click({ force: true })
      })

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.findByTestId('cancel-edit-template-terms-button').click()
    cy.url().should('include', TEMPLATES_PAGE_URL)

    cy.findByText(templateName)
      .closest('tr')
      .within(() => {
        cy.findByLabelText('Delete').should('exist').click({ force: true })
      })

    cy.findByText(/Delete Template/i).should('exist')
    cy.findByTestId('confirm-delete-template-button').click()

    cy.findByText(/Template deleted./i).should('exist')
  })

  it('toggles a template as default via the UI', () => {
    cy.visit(CREATE_TEMPLATE_PAGE_URL)

    cy.findByLabelText(/Template Name/).type(templateName, { force: true })
    cy.findByLabelText(/^Title/i).type('Default Template Title', { force: true })

    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).type('Test Author', { force: true })
      })

    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^E-mail/i).type('test@example.com', { force: true })
      })

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).type('Template description', { force: true })
      })

    cy.findByText('Subject')
      .closest('.row')
      .within(() => {
        cy.findByLabelText('Toggle options menu').click({ force: true })
        cy.findByLabelText('Agricultural Sciences').click({ force: true })
      })

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.findByText(/Success! Template has been created./i).should('exist')
    cy.findByTestId('cancel-edit-template-terms-button').click()
    cy.url().should('include', TEMPLATES_PAGE_URL)

    cy.findByText(templateName)
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: 'Make Default' }).click()
      })

    cy.findByText(
      /The template has been selected as the default template for this dataverse./i
    ).should('exist')

    cy.findByText(templateName)
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: 'Default' }).should('be.disabled')
        cy.findByRole('button', { name: 'Make Default' }).should('not.exist')
      })

    cy.findByText(templateName)
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: 'Default' }).click({ force: true })
      })

    cy.findByText(
      /The template has been removed as the default template for this dataverse./i
    ).should('exist')

    cy.findByText(templateName)
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: 'Make Default' }).should('exist')
      })
  })

  it('sets a template as default and verifies it is auto-selected when creating a dataset', () => {
    cy.visit(CREATE_TEMPLATE_PAGE_URL)

    cy.findByLabelText(/Template Name/).type(templateName, { force: true })
    cy.findByLabelText(/^Title/i).type('Auto Selected Title', { force: true })

    cy.findByText('Author')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Name/i).type('Test Author', { force: true })
      })

    cy.findByText('Point of Contact')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^E-mail/i).type('test@example.com', { force: true })
      })

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).type('Auto selected description', { force: true })
      })

    cy.findByText('Subject')
      .closest('.row')
      .within(() => {
        cy.findByLabelText('Toggle options menu').click({ force: true })
        cy.findByLabelText('Agricultural Sciences').click({ force: true })
      })

    cy.findByRole('button', { name: 'Save + Add Terms' }).click()
    cy.findByText(/Success! Template has been created./i).should('exist')
    cy.findByTestId('cancel-edit-template-terms-button').click()

    cy.findByText(templateName)
      .closest('tr')
      .within(() => {
        cy.findByRole('button', { name: 'Make Default' }).click()
      })

    cy.findByText(
      /The template has been selected as the default template for this dataverse./i
    ).should('exist')

    cy.visit(CREATE_DATASET_PAGE_URL)
    cy.wait(3_000)

    cy.findByTestId('dataset-template-select').within(() => {
      cy.findByText(templateName).should('exist')
      cy.findByText('None').should('not.exist')
    })

    cy.findByLabelText(/^Title/i).should('have.value', 'Auto Selected Title')

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).should('have.value', 'Auto selected description')
      })
  })
})
