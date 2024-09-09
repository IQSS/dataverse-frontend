import { TestsUtils } from '../../../shared/TestsUtils'
import { faker } from '@faker-js/faker'

describe('Create Collection', () => {
  before(() => {
    TestsUtils.setup()
  })

  beforeEach(() => {
    TestsUtils.login()
  })

  it('navigates to the collection page after submitting a valid form', () => {
    cy.visit('/spa/collections/root/create')

    const collectionName = faker.lorem.words(3)

    cy.findByLabelText(/^Collection Name/i).clear()
    cy.findByLabelText(/^Collection Name/i).type(collectionName)

    cy.findByRole('button', { name: 'Apply suggestion' }).click()

    cy.findByLabelText(/^Category/i).select(1)

    cy.findByRole('button', { name: 'Create Collection' }).click()

    cy.findByRole('heading', { name: collectionName }).should('exist')
    cy.findByText('Success!').should('exist')
  })

  it('redirects to the Log i¡In page when the user is not authenticated', () => {
    cy.wrap(TestsUtils.logout())

    cy.visit('/spa/collections/root/create')
    cy.get('#login-container').should('exist')
    cy.url().should('include', '/loginpage.xhtml')
  })
})
