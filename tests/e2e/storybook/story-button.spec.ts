describe('Button Story Test', () => {
  it('Should display the button', () => {
    Cypress.config('baseUrl', 'http://localhost:6006')
    cy.visit('/iframe.html?id=ui-button--primary')
    cy.pause()
    cy.get('[data-testid="button-test"]').should('exist')
  })
})
