import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetLabelValue } from '../../../../../src/dataset/domain/models/Dataset'
import { DatasetHelper } from '@tests/e2e-integration/shared/datasets/DatasetHelper'

const CREATE_DATASET_PAGE_URL = '/spa/datasets/root/create'

describe('Create Dataset', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('visits the Create Dataset Page as a logged in user', () => {
    cy.visit(CREATE_DATASET_PAGE_URL)

    cy.findByRole('heading', { name: 'Create Dataset' }).should('exist')
  })

  it('navigates to the new dataset after submitting a valid form', () => {
    cy.visit(CREATE_DATASET_PAGE_URL)

    cy.findByLabelText(/^Title/i).type('Test Dataset Title', { force: true })

    cy.findByText('Description')
      .closest('.row')
      .within(() => {
        cy.findByLabelText(/^Text/i).type('Test description text', { force: true })
      })

    cy.findByText('Subject')
      .closest('.row')
      .within(() => {
        cy.findByLabelText('Toggle options menu').click({ force: true })

        cy.findByLabelText('Agricultural Sciences').click()
        cy.findByLabelText('Arts and Humanities').click()
      })
    cy.findByText(/Save Dataset/i).click()

    cy.findByRole('heading', { name: 'Test Dataset Title' }).should('exist')
    cy.findByText(/Dataset created successfully./).should('exist')
    cy.findByText(DatasetLabelValue.DRAFT).should('exist')
    cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
    cy.contains('Agricultural Sciences; Arts and Humanities').should('exist')
  })

  describe('dataset template selection', () => {
    let datasetTemplateId: number

    beforeEach(async () => {
      await DatasetHelper.createDatasetTemplate()
      const templates = await DatasetHelper.getDatasetTemplates()

      const { id } = templates[0]
      datasetTemplateId = id
    })

    afterEach(async () => {
      await DatasetHelper.deleteDatasetTemplate(datasetTemplateId)
    })

    it('shows template select when a template is available and prefill fields when a template is selected', () => {
      cy.visit(CREATE_DATASET_PAGE_URL)

      cy.wait(3_000)

      cy.findByTestId('dataset-template-select').should('exist').as('templateSelect')
      cy.findByText('None').should('exist') // No default template, None is shown

      cy.get('@templateSelect').within(() => {
        cy.findByLabelText('Toggle options menu').click({ force: true })
        cy.findByText('Dataset Template One').click({ force: true })
      })

      cy.findByLabelText(/^Title/i).should('have.value', 'Dataset Template One Title')

      cy.findByText('Description')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/^Text/i).should(
            'have.value',
            'This is the description from Dataset Template One'
          )
        })

      cy.findByText('Subject')
        .should('exist')
        .closest('.row')
        .within(() => {
          cy.findByLabelText('Toggle options menu').click({ force: true })

          cy.findByLabelText('Agricultural Sciences').should('be.checked')
          cy.findByLabelText('Arts and Humanities').should('be.checked')
        })

      cy.findByText('Author')
        .closest('.row')
        .within(() => {
          cy.findByLabelText(/^Name/i).should('have.value', 'Belicheck, Bill')
          cy.findByLabelText(/^Identifier Type/i).should('have.value', 'ORCID')
        })

      cy.findByText(/Save Dataset/i).click()

      cy.findByRole('heading', { name: 'Dataset Template One Title' }).should('exist')
      cy.findByText(/Dataset created successfully./).should('exist')
      cy.findByText(DatasetLabelValue.DRAFT).should('exist')
      cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
      cy.contains('Agricultural Sciences; Arts and Humanities').should('exist')
    })
  })

  it('should redirect the user to the Login page when the user is not authenticated', () => {
    TestsUtils.logout()

    // Visit a protected route 🔐, ProtectedRoute component should redirect automatically to the Keycloack login page
    cy.visit(CREATE_DATASET_PAGE_URL)

    // Check if the Keycloak login form is present
    cy.get('#kc-form-login').should('exist')
  })

  it('should redirect the user back to the create dataset page after a successful login', () => {
    TestsUtils.logout()

    cy.visit(CREATE_DATASET_PAGE_URL)

    // Check if the Keycloak login form is present
    cy.get('#kc-form-login').should('exist')

    // Enter the credentials in the Keycloak login form
    TestsUtils.enterCredentialsInKeycloak()

    // Check if the user is redirected back to the create dataset page
    cy.url().should('eq', `${Cypress.config().baseUrl as string}${CREATE_DATASET_PAGE_URL}`)

    cy.findByRole('heading', { name: 'Create Dataset' }).should('exist')
  })
})
