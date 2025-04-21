import { TestsUtils } from '../../../shared/TestsUtils'
import { DatasetLabelValue } from '../../../../../src/dataset/domain/models/Dataset'

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
    cy.findByText('Success!').should('exist')
    cy.contains('This dataset has been created.').should('exist')
    cy.findByText(DatasetLabelValue.DRAFT).should('exist')
    cy.findByText(DatasetLabelValue.UNPUBLISHED).should('exist')
    cy.contains('Agricultural Sciences; Arts and Humanities').should('exist')
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
