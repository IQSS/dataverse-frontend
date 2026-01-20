import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetHelper } from '@tests/e2e-integration/shared/datasets/DatasetHelper'

const CREATE_TEMPLATE_PAGE_URL = '/spa/root/templates/create'
const TEMPLATES_PAGE_URL = '/spa/root/templates'

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

    cy.findByRole('button', { name: 'Cancel' }).click()
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
    cy.findByRole('button', { name: 'Cancel' }).click()
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
})
