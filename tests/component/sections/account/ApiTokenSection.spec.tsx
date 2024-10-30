import { ApiTokenSection } from '../../../../src/sections/account/api-token-section/ApiTokenSection'
import { ApiTokenInfoRepository } from '@/users/domain/repositories/ApiTokenInfoRepository'
describe('ApiTokenSection', () => {
  const mockApiTokenInfo = {
    apiToken: 'mocked-api',
    expirationDate: '2024-12-31'
  }
  const newMockApiTokenInfo = {
    apiToken: 'new-mocked-api',
    expirationDate: '2025-12-31'
  }

  let apiTokenRepository: ApiTokenInfoRepository

  beforeEach(() => {
    apiTokenRepository = {
      getCurrentApiToken: cy.stub().resolves(mockApiTokenInfo),
      recreateApiToken: cy.stub().resolves(mockApiTokenInfo),
      deleteApiToken: cy.stub().resolves()
    }

    cy.mountAuthenticated(<ApiTokenSection repository={apiTokenRepository} />)
  })

  it('should show the loading skeleton while fetching the token', () => {
    apiTokenRepository.getCurrentApiToken = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(500).then(() => mockApiTokenInfo)
    })

    cy.mount(<ApiTokenSection repository={apiTokenRepository} />)
    cy.get('[data-testid="loadingSkeleton"]').should('exist')

    cy.wait(500)
    cy.get('[data-testid="loadingSkeleton"]').should('not.exist')
  })

  it('should copy the api token to the clipboard', () => {
    cy.window().then((win) => {
      cy.stub(win.navigator.clipboard, 'writeText').resolves()

      cy.findByRole('button', { name: /Copy to Clipboard/ }).click()

      cy.get('[data-testid="api-token"]').then(($element) => {
        const textToCopy = $element.text()

        // eslint-disable-next-line @typescript-eslint/unbound-method
        cy.wrap(win.navigator.clipboard.writeText).should('be.calledWith', textToCopy)
      })
    })
  })

  it('should fetch and display the current API token', () => {
    cy.get('[data-testid="api-token"]').should('contain.text', mockApiTokenInfo.apiToken)
    cy.get('[data-testid="expiration-date"]').should(
      'contain.text',
      mockApiTokenInfo.expirationDate
    )
  })

  it('should recreate and display a new API token', () => {
    apiTokenRepository.recreateApiToken = cy.stub().resolves(newMockApiTokenInfo)
    cy.get('button').contains('Recreate Token').click()
    cy.get('[data-testid="api-token"]').should('contain.text', newMockApiTokenInfo.apiToken)
    cy.get('[data-testid="expiration-date"]').should(
      'contain.text',
      newMockApiTokenInfo.expirationDate
    )
  })

  it('should revoke the API token and show the create token state when there is no api token', () => {
    cy.get('button').contains('Revoke Token').click()
    cy.get('[data-testid="noApiToken"]').should('exist')
    cy.get('button').contains('Create Token').should('exist')
  })
})
