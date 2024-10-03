import { ApiTokenSection } from '../../../../src/sections/account/api-token-section/ApiTokenSection'

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
})
