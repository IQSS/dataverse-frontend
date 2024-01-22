describe('File', () => {
  it('successfully loads', () => {
    cy.visit('/spa/files?id=23')
    cy.findAllByText('File Title').should('exist')
  })
})
