import { Layout } from '../../../../src/sections/layout/Layout'

describe('Layout', () => {
  it('renders the Header', () => {
    cy.mount(<Layout></Layout>)

    cy.findByRole('img', { name: 'brandLogoImage' }).should('exist')
    cy.findByText('brandTitle').should('exist')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'signUp' }).should('exist')
    cy.findByRole('link', { name: 'logIn' }).should('exist')
  })
  it('renders the Footer', () => {
    cy.mount(<Layout></Layout>)

    it('displays the Powered By link', () => {
      cy.mount(<Layout></Layout>)
      cy.findByRole('link', { name: 'The Dataverse Project logo' }).should('exist')
    })

    it('displays the Privacy Policy', () => {
      cy.mount(<Layout></Layout>)
      cy.findByText('privacyPolicy').should('exist')
    })
  })
})
