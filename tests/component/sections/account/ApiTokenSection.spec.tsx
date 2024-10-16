import { ApiTokenSection } from '../../../../src/sections/account/api-token-section/ApiTokenSection'
import { ApiTokenInfoJSDataverseRepository } from '../../../../src/api-token-info/infrastructure/ApiTokenInfoJSDataverseRepository'

describe('ApiTokenSection', () => {
  beforeEach(() => {
    cy.mountAuthenticated(<ApiTokenSection />)
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

  // TODO: When we get the api token from the use case, we could mock the response and test more things.
  describe('when fetching the current API token', () => {
    it('should fetch and display the current API token', () => {
      const mockApiToken = 'mocked-api-token'
      const mockExpirationDate = '2024-12-31'

      //TODO: we need change the fake call to the real one once we have the api working
      cy.stub(ApiTokenInfoJSDataverseRepository.prototype, 'getCurrentApiToken').callsFake(() =>
        Promise.resolve({
          apiToken: mockApiToken,
          expirationDate: mockExpirationDate
        })
      )
      cy.mountAuthenticated(<ApiTokenSection />)

      cy.get('[data-testid="api-token"]').should('contain.text', mockApiToken)
      cy.get('[data-testid="expiration-date"]').should('contain.text', mockExpirationDate)
    })
    it('should display skeleton when the API token is fetching', () => {
      it('should display skeleton when the API token is fetching', () => {
        cy.stub(ApiTokenInfoJSDataverseRepository.prototype, 'getCurrentApiToken').callsFake(
          () => new Promise(() => {})
        )

        cy.get('[data-testid="loadingSkeleton"]').should('exist')
      })
    })
  })
})
