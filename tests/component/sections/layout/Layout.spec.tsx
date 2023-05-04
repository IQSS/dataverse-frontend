import { Layout } from '../../../../src/sections/layout/Layout'

describe('Layout', () => {
  it('renders the Header', () => {
    cy.customMount(<Layout></Layout>)

    cy.findByRole('img', { name: 'Brand Logo Image' }).should('exist')
    cy.findByText('Dataverse').should('exist')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Sign Up' }).should('exist')
    cy.findByRole('link', { name: 'Log In' }).should('exist')
  })
  it('renders the Footer', () => {
    cy.customMount(<Layout></Layout>)

    it('displays the Powered By link', () => {
      cy.customMount(<Layout></Layout>)
      cy.findByRole('link', { name: 'The Dataverse Project logo' }).should('exist')
    })

    it('displays the Privacy Policy', () => {
      cy.customMount(<Layout></Layout>)
      cy.findByText('privacyPolicy').should('exist')
    })
  })
})
