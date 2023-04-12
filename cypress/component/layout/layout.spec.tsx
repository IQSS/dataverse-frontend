import { Layout } from '../../../src/sections/layout/Layout'

describe('Layout', () => {
  it('renders the Header', () => {
    cy.mount(<Layout></Layout>)

    cy.get('a').should('contain.text', 'brandTitle')
    cy.get('img').should('have.attr', 'alt', 'brandLogoImage')
    cy.get('a').should('contain.text', 'signUp')
    cy.get('a').should('contain.text', 'logIn')
  })
  it('renders the Footer', () => {
    cy.mount(<Layout></Layout>)

    cy.get('[data-testid="footer"]').should('be.visible')
    cy.get('[data-testid="poweredBy"]').should('be.visible')
    cy.get('img').should('have.attr', 'alt', 'brandLogoImage')
  })
})
