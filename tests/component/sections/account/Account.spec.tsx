import { Account } from '../../../../src/sections/account/Account'

describe('Account', () => {
  it('should render the correct breadcrumbs', () => {
    cy.mountAuthenticated(<Account />)

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Account')
      .should('have.class', 'active')
  })
})
