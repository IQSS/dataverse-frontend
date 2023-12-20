describe('Home Page', () => {
  it('successfully loads', () => {
    cy.visit('/spa')
    cy.findAllByText(/Root/i).should('exist')
  })

  it('log in Dataverse Admin user', () => {
    cy.loginAsAdmin('/spa')

    cy.findAllByText(/Root/i).should('exist')
    cy.findByText(/Dataverse Admin/i).should('exist')
  })

  it('log out Dataverse Admin user', () => {
    cy.loginAsAdmin('/spa')

    cy.findAllByText(/Root/i).should('exist')

    cy.findByText(/Dataverse Admin/i).click()
    cy.findByRole('button', { name: /Log Out/i }).click()
    cy.findByText(/Dataverse Admin/i).should('not.exist')
  })
})
