import { createSandbox, SinonSandbox } from 'sinon'
import { FooterFactory } from '../../../../src/sections/layout/footer/FooterFactory'
import { FooterMother } from './footer/FooterMother'
import { Layout } from '../../../../src/sections/layout/Layout'
import { applyTestAppConfig } from '../../../support/bootstrapAppConfig'
import type { AppConfig } from '@/config'
import i18next from '@/i18n'

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
    cy.clearAllLocalStorage()
    cy.wrap(i18next.changeLanguage('en'))
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

  it('renders the banner message for the selected header language', () => {
    Cypress.env('bannerMessage', {
      en: 'English <strong>banner</strong>',
      es: 'Banner en español <strong>moderno</strong>'
    })
    applyTestAppConfig()

    cy.customMount(<Layout />)

    cy.findByRole('alert').within(() => {
      cy.findByText('English', { exact: false }).should('exist')
      cy.findByText('Banner en español', { exact: false }).should('not.exist')
    })

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.get('#language-switcher-dropdown').click()
    cy.findByText('Español').click()

    cy.findByRole('alert').within(() => {
      cy.findByText('Banner en español', { exact: false }).should('exist')
      cy.get('strong').should('contain.text', 'moderno')
      cy.findByText('English', { exact: false }).should('not.exist')
    })
  })

  it('falls back to the default language banner when the selected language is not configured', () => {
    Cypress.env('bannerMessage', {
      en: 'Default language banner'
    })
    applyTestAppConfig()

    cy.wrap(i18next.changeLanguage('es'))
    cy.customMount(<Layout />)

    cy.findByRole('alert').should('contain.text', 'Default language banner')
  })
})
