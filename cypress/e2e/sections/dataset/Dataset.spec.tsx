describe('Dataset', () => {
  it('successfully loads a dataset when passing the id', () => {
    cy.visit('/dataset/12345')

    cy.findByRole('heading', { name: 'Dataset Title' }).should('exist')
    cy.findByText('Version 1.0').should('exist')
    cy.findByText('Draft').should('exist')
  })

  it('renders Hello Dataverse when no id is provided', () => {
    cy.visit('/dataset')

    cy.findAllByText(/Hello Dataverse/i).should('exist')
  })

  // TODO - Add test for when the dataset is not found and loading skeleton when the js-dataverse module is ready
})
