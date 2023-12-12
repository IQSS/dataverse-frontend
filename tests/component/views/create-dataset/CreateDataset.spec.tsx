import CreateDatasetContainer from '../../../../src/views/create-dataset/CreateDatasetContainer'

describe('Form component', () => {
  it('should render all form fields', () => {
    cy.customMount(<CreateDatasetContainer />)
    cy.get('[data-cy=datasetFormInputTitle]').should('be.visible')
    cy.get('[data-cy=datasetFormSubmit]').should('be.visible')
    cy.get('[data-cy=datasetFormCancel]').should('be.visible')
  })

  it('should submit the form with correct values', () => {
    cy.customMount(<CreateDatasetContainer />)

    cy.get('[data-cy=datasetFormInputTitle]').type('Test Dataset Title')

    cy.get('[data-cy=datasetFormSubmit]').click()

    // Wait for the form submission to complete (adjust the timeout as needed)
    cy.wait(4000)

    // Assert that the form was successfully submitted
    cy.contains('Form Submitted!')
  })
})
