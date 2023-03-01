describe('Hello Dataverse', () => {
  it('successfully loads', () => {
    cy.visit('/')
    cy.findAllByText(/Hello Dataverse/i).should('exist')
  })
})
