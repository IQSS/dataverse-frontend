import { createSandbox, SinonSandbox } from 'sinon'
import { FooterFactory } from '../../../../src/sections/layout/footer/FooterFactory'
import { FooterMother } from './footer/FooterMother'
import { Layout } from '../../../../src/sections/layout/Layout'
import { applyTestAppConfig } from '../../../support/bootstrapAppConfig'
import type { AppConfig } from '@/config'

describe('Layout', () => {
  const sandbox: SinonSandbox = createSandbox()
  const defaultBannerMessageEnv = Cypress.env('bannerMessage') as AppConfig['bannerMessage']

  beforeEach(() => {
    sandbox.stub(FooterFactory, 'create').returns(FooterMother.withDataverseVersion(sandbox))
  })

  afterEach(() => {
    sandbox.restore()
    Cypress.env('bannerMessage', defaultBannerMessageEnv)
    applyTestAppConfig()
  })

  it('renders the header', () => {
    cy.customMount(<Layout />)

    cy.findByAltText('Brand Logo Image').should('exist')
    cy.findByText('Dataverse').should('exist')

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('button', { name: 'Log In' }).should('exist')
  })

  it('renders the Footer', () => {
    cy.customMount(<Layout />)

    cy.findByRole('link', { name: 'The Dataverse Project logo' }).should('exist')
    cy.findByText('Privacy Policy').should('exist')
  })

  it('does not render a banner when bannerMessage is not configured', () => {
    Cypress.env('bannerMessage', undefined)
    applyTestAppConfig()

    cy.customMount(<Layout />)

    cy.findByRole('alert').should('not.exist')
  })

  it('renders banner markup from config after sanitizing it', () => {
    Cypress.env(
      'bannerMessage',
      'You are using the new Dataverse <strong>Modern version</strong>. <script>alert("xss")</script>'
    )
    applyTestAppConfig()

    cy.customMount(<Layout />)

    cy.findByRole('alert').within(() => {
      cy.findByText('You are using the new Dataverse', { exact: false }).should('exist')
      cy.get('strong').should('contain.text', 'Modern version')
      cy.get('script').should('not.exist')
    })
  })
})
