import { Footer } from '../../../../src/sections/layout/footer/Footer'

describe('Footer component', () => {
  it('displays the Powered By link', () => {
    cy.mount(<Footer />)
    cy.get('[data-testid="footer"]').should('be.visible')
    cy.get('[data-testid="poweredBy"]').should('be.visible')
  })

  it('displays the Privacy Policy', () => {
    cy.mount(<Footer />)
    cy.get('a').should('contain.text', 'privacyPolicy')
  })
})
