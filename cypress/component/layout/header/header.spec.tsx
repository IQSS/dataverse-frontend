import { I18nextProvider } from 'react-i18next'
import i18next from '../../../../src/i18n'
import { HeaderMother } from '../../../../tests/sections/layout/header/HeaderMother'
import { createSandbox, SinonSandbox } from 'sinon'
import { UserMother } from '../../../../tests/users/domain/models/UserMother'

describe('Header component', () => {
  const sandbox: SinonSandbox = createSandbox()
  const testUser = UserMother.create()

  afterEach(() => {
    sandbox.restore()
  })

  it('displays the user name when the user is logged in', () => {
    cy.mount(
      <I18nextProvider i18n={i18next}>
        {HeaderMother.withLoggedInUser(sandbox, testUser)}
      </I18nextProvider>
    )
    cy.pause()
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByText(testUser.name).should('be.visible')
    cy.findByText(testUser.name).click()
    cy.findByText('Log Out').should('be.visible')
  })

  it('displays the Sign Up and Log In links when the user is not logged in', () => {
    cy.mount(HeaderMother.withGuestUser(sandbox))
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Sign Up' }).should('exist')
    cy.contains('Sign Up')
    cy.contains('Log In')
  })
})
