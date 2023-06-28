import { createSandbox, SinonSandbox } from 'sinon'
import { HeaderFactory } from '../../../../src/sections/layout/header/HeaderFactory'
import { HeaderMother } from './header/HeaderMother'
import { FooterFactory } from '../../../../src/sections/layout/footer/FooterFactory'
import { FooterMother } from './footer/FooterMother'
import { Layout } from '../../../../src/sections/layout/Layout'

describe('Layout', () => {
  const sandbox: SinonSandbox = createSandbox()

  afterEach(() => {
    sandbox.restore()
    sandbox.stub(HeaderFactory, 'create').returns(HeaderMother.withLoggedInUser(sandbox))
    sandbox.stub(FooterFactory, 'create').returns(FooterMother.withDataverseVersion(sandbox))
  })

  it('renders the header', () => {
    cy.customMount(<Layout />)

    cy.findByAltText('Brand Logo Image').should('exist')
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
