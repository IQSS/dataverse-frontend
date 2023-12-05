import { CreateDataset } from '../../../../src/views/create-dataset/CreateDataset'

describe('Form component', () => {
  it('should render all form fields', () => {
    cy.customMount(<CreateDataset />)
    cy.get('[data-cy=datasetFormInputTitle]').should('be.visible')
    cy.get('[data-cy=datasetFormSubmit]').should('be.visible')
    cy.get('[data-cy=datasetFormCancel]').should('be.visible')
  })

  it('should submit the form with correct values', () => {
    cy.customMount(<CreateDataset />)

    cy.get('[data-cy=datasetFormInputTitle]').type('Test Dataset Title')

    cy.get('[data-cy=datasetFormSubmit]').click()

    // Wait for the form submission to complete (adjust the timeout as needed)
    cy.wait(4000)

    // Assert that the form was successfully submitted
    cy.contains('Form Submitted!')
  })
})
