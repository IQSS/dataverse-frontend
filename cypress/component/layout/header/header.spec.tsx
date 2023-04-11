import { Header } from '../../../../src/sections/layout/header/Header'
describe('Header component', () => {
  it('displays the user name when the user is logged in', () => {
    const user = { name: 'John Doe' }
    cy.mount(<Header user={user} />)
    cy.get('.navbar-toggler-icon').click()
    cy.contains('John Doe').should('be.visible')
    cy.contains('John Doe').click()
    cy.pause()
    cy.contains('logOut')
  })

  it('displays the Sign Up and Log In links when the user is not logged in', () => {
    cy.mount(<Header />)
    cy.contains('signUp')
    cy.contains('logIn')
  })
})
