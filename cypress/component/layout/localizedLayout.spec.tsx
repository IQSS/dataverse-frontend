import { Layout } from '../../../src/sections/layout/Layout'
import { I18nextProvider } from 'react-i18next'
import i18next from '../../../src/i18n'
describe('Layout', () => {
  it('contains localized text', () => {
    cy.mount(
      <I18nextProvider i18n={i18next}>
        <Layout></Layout>)
      </I18nextProvider>
    )

    cy.contains('Powered by')
  })

  it('renders the Header', () => {
    cy.mount(<Layout></Layout>)

    cy.get('a').should('contain.text', 'Dataverse')
    cy.get('img').should('have.attr', 'alt', 'Dataverse brand logo')
    cy.get('a').should('contain.text', 'Sign Up')
    cy.get('a').should('contain.text', 'Log In')
  })
  it('renders the Footer', () => {
    cy.mount(<Layout></Layout>)

    cy.get('[data-testid="footer"]').should('be.visible')
    cy.get('[data-testid="poweredBy"]').should('be.visible')
  })
})
