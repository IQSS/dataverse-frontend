import { Layout } from '../../../src/sections/layout/Layout'
import { I18nextProvider } from 'react-i18next'
import i18n from 'i18next'
describe('Layout', () => {
  it('contains localized text', () => {
    cy.mount(
      <I18nextProvider i18n={i18n}>
        <Layout></Layout>)
      </I18nextProvider>
    )

    cy.contains('Powered By')
  })

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
