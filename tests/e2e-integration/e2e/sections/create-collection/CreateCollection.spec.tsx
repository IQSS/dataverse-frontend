import { TestsUtils } from '../../../shared/TestsUtils'
import { faker } from '@faker-js/faker'

const CREATE_COLLECTION_PAGE_URL = '/spa/collections/root/create'

describe('Create Collection', () => {
  beforeEach(() => {
    TestsUtils.login().then((token) => {
      cy.wrap(TestsUtils.setup(token))
    })
  })

  it('visits the Create Collection Page as a logged in user', () => {
    cy.visit(CREATE_COLLECTION_PAGE_URL)

    cy.findByRole('heading', { name: 'Create Collection' }).should('exist')
  })

  it('navigates to the collection page after submitting a valid form', () => {
    cy.visit(CREATE_COLLECTION_PAGE_URL)

    const collectionName = faker.lorem.words(3)

    cy.findByLabelText(/^Collection Name/i).clear({ force: true })
    cy.findByLabelText(/^Collection Name/i).type(collectionName, { force: true })

    cy.findByRole('button', { name: 'Apply suggestion' }).click({ force: true })

    cy.findByLabelText(/^Category/i).select(1, { force: true })

    cy.findByRole('button', { name: 'Create Collection' }).click({ force: true })

    cy.findByRole('heading', { name: collectionName }).should('exist')
    cy.findByText('Success!').should('exist')
  })

  it('shows correct selected facets from parent collection in Browse/Search facets section', () => {
    cy.visit(CREATE_COLLECTION_PAGE_URL)

    const collectionName = faker.lorem.words(3)

    cy.findByLabelText(/^Collection Name/i).clear({ force: true })
    cy.findByLabelText(/^Collection Name/i).type(collectionName, { force: true })

    cy.findByRole('button', { name: 'Apply suggestion' }).click({ force: true })

    cy.findByLabelText(/^Category/i).select(1, { force: true })

    // Get Browse/Search facets section elements and apply aliases
    cy.get('[data-testid="use-facets-from-parent-checkbox"]').as('useFacetsFromParentCheckbox')
    cy.get('[data-testid="transfer-list-container"]').as('transferListContainer')
    cy.findByTestId('left-list-group').as('leftList')
    cy.findByTestId('actions-column').as('actionsColumn')
    cy.findByTestId('right-list-group').as('rightList')

    cy.get('@useFacetsFromParentCheckbox').click({ force: true })

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move all left').click()
    })

    cy.get('@rightList').children().should('have.length', 0)

    cy.get('@leftList').within(() => {
      cy.findByLabelText('Topic Classification Term').check({ force: true })
    })

    cy.get('@actionsColumn').within(() => {
      cy.findByLabelText('move selected to right').click()
    })

    cy.get('@rightList').children().should('have.length', 1)

    cy.findByRole('button', { name: 'Create Collection' }).click({ force: true })

    cy.findByRole('heading', { name: collectionName }).should('exist')
    cy.findByText('Success!').should('exist')

    // Now we go to create a new collection inside the recently created one and check if the selected facets are the same as the previous collection
    cy.findAllByRole('button', { name: /Add Data/i })
      .last()
      .click()
    cy.findByText('New Collection').click()

    cy.get('@leftList').within(() => {
      cy.findByLabelText('Topic Classification Term').should('not.exist')
    })

    cy.get('@rightList').children().should('have.length', 1)

    cy.get('@rightList').within(() => {
      cy.findByLabelText('Topic Classification Term').should('exist')
    })
  })

  it('should redirect the user to the Login page when the user is not authenticated', () => {
    TestsUtils.logout()

    // Visit a protected route 🔐, ProtectedRoute component should redirect automatically to the Keycloack login page
    cy.visit(CREATE_COLLECTION_PAGE_URL)

    // Check if the Keycloak login form is present
    cy.get('#kc-form-login').should('exist')
  })

  it('should redirect the user back to the create collection page after a successful login', () => {
    TestsUtils.logout()

    cy.visit(CREATE_COLLECTION_PAGE_URL)

    // Check if the Keycloak login form is present
    cy.get('#kc-form-login').should('exist')

    TestsUtils.enterCredentialsInKeycloak()

    // Check if the user is redirected back to the create collection page
    cy.url().should('eq', `${Cypress.config().baseUrl as string}${CREATE_COLLECTION_PAGE_URL}`)

    cy.findByRole('heading', { name: 'Create Collection' }).should('exist')
  })
})
