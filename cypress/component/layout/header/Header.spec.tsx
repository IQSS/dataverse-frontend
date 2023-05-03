import { Header } from '../../../../src/sections/layout/header/Header'
import { I18nextProvider } from 'react-i18next'
import i18next from '../../../../src/i18n'

describe('Header component', () => {
  it('displays the user name when the user is logged in', () => {
    const user = { name: 'John Doe' }

    cy.mount(
      <I18nextProvider i18n={i18next}>
        <Header user={user} />
      </I18nextProvider>
    )
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByText(user.name).should('be.visible')
    cy.findByText(user.name).click()
    cy.findByText('Log Out').should('be.visible')
  })

  it('displays the Sign Up and Log In links when the user is not logged in', () => {
    cy.mount(<Header />)
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Sign Up' }).should('exist')
    cy.contains('Sign Up')
    cy.contains('Log In')
  })
})
