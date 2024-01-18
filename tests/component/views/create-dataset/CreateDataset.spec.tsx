// import DatasetCreate from '../../../../src/sections/create-dataset/CreateDatasetContext'
import { CreateDatasetForm } from '../../../../src/sections/create-dataset/CreateDatasetFactory'
import { mount } from 'cypress/react18'

describe('Form component', () => {
  it('renders the Create Dataset page and its contents', () => {
    mount(<CreateDatasetForm />)
    cy.findByText(/Create Dataset/i).should('exist')

    cy.findByLabelText(/Title/i).should('exist')

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  it('can submit a valid form', () => {
    cy.log('Submit form')
    mount(<CreateDatasetForm />)
    cy.findByLabelText(/Title/i)
      .should('exist')
      .type('Test Dataset Title')
      .and('have.value', 'Test Dataset Title')

    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Form submitted successfully!')
  })
})
