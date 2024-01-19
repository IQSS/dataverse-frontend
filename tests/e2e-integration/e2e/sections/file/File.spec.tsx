describe('File', () => {
  it('successfully loads', () => {
    cy.visit('/spa/files?id=23')
    cy.findAllByText('file.csv').should('exist')
  })
})
