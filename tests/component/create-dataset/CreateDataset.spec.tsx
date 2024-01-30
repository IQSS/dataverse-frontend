import { CreateDatasetForm } from '../../../src/sections/create-dataset/CreateDatasetForm'

describe('Form component', () => {
  it('renders the Create Dataset page and its contents', () => {
    cy.customMount(<CreateDatasetForm />)
    cy.findByText(/Create Dataset/i).should('exist')

    cy.findByLabelText(/Title/i).should('exist')

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  it('can submit a valid form', () => {
    cy.customMount(<CreateDatasetForm />)
    cy.findByLabelText(/Title/i)
      .should('exist')
      .type('Test Dataset Title')
      .should('have.attr', 'required', 'required')
      .and('have.value', 'Test Dataset Title')

    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Form submitted successfully!')
  })
})
