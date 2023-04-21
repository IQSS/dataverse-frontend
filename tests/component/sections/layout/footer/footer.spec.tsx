import { Footer } from '../../../../../src/sections/layout/footer/Footer'

describe('Footer component', () => {
  it('displays the Powered By link', () => {
    cy.mount(<Footer />)
    cy.findByRole('link', { name: 'The Dataverse Project logo' }).should('exist')
  })

  it('displays the Privacy Policy', () => {
    cy.mount(<Footer />)
    cy.findByText('privacyPolicy').should('exist')
  })
})
