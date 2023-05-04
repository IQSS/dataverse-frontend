import { Header } from '../../../../../src/sections/layout/header/Header'

describe('Header component', () => {
  it('displays the user name when the user is logged in', () => {
    const user = { name: 'John Doe' }

    cy.customMount(<Header user={user} />)
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByText(user.name).should('be.visible')
    cy.findByText(user.name).click()
    cy.findByText('Log Out').should('be.visible')
  })

  it('displays the Sign Up and Log In links when the user is not logged in', () => {
    cy.customMount(<Header />)
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Sign Up' }).should('exist')
    cy.contains('Sign Up')
    cy.contains('Log In')
  })
})
