import { Usage } from '@/sections/homepage/usage/Usage'
import { applyTestAppConfig } from '@tests/support/bootstrapAppConfig'
import type { AppConfig } from '@/config'

describe('Usage', () => {
  const collectionId = 'test-collection-id'
  const defaultHomepageEnv = Cypress.env('homepage') as AppConfig['homepage']
  const defaultBrandingEnv = Cypress.env('branding') as AppConfig['branding']

  afterEach(() => {
    Cypress.env('homepage', defaultHomepageEnv)
    Cypress.env('branding', defaultBrandingEnv)
    applyTestAppConfig()
  })

  it('renders usage cards and links to create dataset and collection routes', () => {
    cy.customMount(<Usage collectionId={collectionId} />)

    cy.findByRole('heading', {
      name: 'Deposit and share your data. Get academic credit.'
    }).should('be.visible')
    cy.findByRole('heading', {
      name: 'Organize datasets and gather metrics in your own repository.'
    }).should('be.visible')

    cy.findByRole('link', { name: 'Add a dataset' }).should(
      'have.attr',
      'href',
      `/datasets/${collectionId}/create`
    )
    cy.findByRole('link', { name: 'Add a collection' }).should(
      'have.attr',
      'href',
      `/collections/${collectionId}/create`
    )
  })

  it('uses app config branding and support URL for the general card', () => {
    const supportUrl = 'https://example.org/help'

    Cypress.env('branding', { dataverseName: 'Testverse' })
    Cypress.env('homepage', { supportUrl })
    applyTestAppConfig()

    cy.customMount(<Usage collectionId={collectionId} />)

    cy.findByRole('heading', {
      name: 'Publishing your data is easy on Testverse!'
    }).should('be.visible')
    cy.findByText(
      'Testverse is a repository for research data. Deposit data and code here.'
    ).should('be.visible')
    cy.findByRole('link', { name: 'Getting started' })
      .should('have.attr', 'href', supportUrl)
      .and('have.attr', 'target', '_blank')
      .and('have.attr', 'rel', 'noreferrer noopener')
  })

  it('falls back to Dataverse when config dataverse name is missing', () => {
    Cypress.env('branding', {})
    applyTestAppConfig()

    cy.customMount(<Usage collectionId={collectionId} />)

    cy.findByRole('heading', {
      name: 'Publishing your data is easy on Dataverse!'
    }).should('be.visible')
    cy.findByText(
      'Dataverse is a repository for research data. Deposit data and code here.'
    ).should('be.visible')
  })

  it('falls back to the default support URL when config support URL is missing', () => {
    Cypress.env('homepage', {})
    applyTestAppConfig()

    cy.customMount(<Usage collectionId={collectionId} />)

    cy.findByRole('link', { name: 'Getting started' }).should(
      'have.attr',
      'href',
      'https://guides.dataverse.org/en/latest/user/index.html'
    )
  })
})
