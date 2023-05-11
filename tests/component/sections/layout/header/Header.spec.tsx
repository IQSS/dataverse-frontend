import { createSandbox, SinonSandbox } from 'sinon'
import { UserMother } from '../../../users/domain/models/UserMother'
import { HeaderMother } from './HeaderMother'

describe('Header component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testUser = UserMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('displays the user name when the user is logged in', () => {
    cy.customMount(HeaderMother.withLoggedInUser(sandbox, testUser))
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByText(testUser.name).should('be.visible')
    cy.findByText(testUser.name).click()
    cy.findByText('Log Out').should('be.visible')
  })

  it('displays the Sign Up and Log In links when the user is not logged in', () => {
    cy.customMount(HeaderMother.withGuestUser(sandbox))
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Sign Up' }).should('exist')
    cy.contains('Sign Up')
    cy.contains('Log In')
  })
})
