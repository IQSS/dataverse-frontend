describe('Hello Dataverse', () => {
  it('successfully loads', () => {
    cy.visit('/spa')
    cy.findAllByText(/Hello Dataverse/i).should('exist')
  })

  it('log in Dataverse Admin user', () => {
    cy.loginAsAdmin('/spa')

    cy.findAllByText(/Hello Dataverse/i).should('exist')
    cy.findByText(/Dataverse Admin/i).should('exist')
  })

  it('log out Dataverse Admin user', () => {
    cy.loginAsAdmin('/spa')

    cy.findAllByText(/Hello Dataverse/i).should('exist')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('link', { name: /Log Out/i }).click()
    cy.findByText(/Dataverse Admin/i).should('not.exist')
  })
})
