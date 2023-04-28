import { Footer } from '../../../../src/sections/layout/footer/Footer'

describe('Footer component', () => {
  it('displays the Powered By link', () => {
    cy.customMount(<Footer />)
    cy.findByRole('link', { name: 'The Dataverse Project logo' }).should('exist')
  })

  it('displays the Privacy Policy', () => {
    cy.customMount(<Footer />)
    cy.findByText('Privacy Policy').should('exist')
  })
})
