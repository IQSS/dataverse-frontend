import DatasetCreateMaster from '../../../../src/sections/create-dataset/CreateDatasetContext'
import { mount } from 'cypress/react18'

describe('Form component', () => {
  it('renders the Create Dataset page and its contents', () => {
    mount(<DatasetCreateMaster />)
    cy.findByText(/Create Dataset/i).should('exist')

    cy.findByText(/Title/i).should('exist')

    cy.get('input[name="createDatasetTitle"]')
      .should('exist')
      .type('Test Dataset Title')
      .should('have.attr', 'required', 'required')
      .and('have.value', 'Test Dataset Title')

    cy.findByText(/Save Dataset/i).should('exist')

    cy.findByText(/Cancel/i).should('exist')
  })

  it('can submit a valid form', () => {
    cy.log('Submit form')
    mount(<DatasetCreateMaster />)
    cy.get('input[name="createDatasetTitle"]')
      .should('exist')
      .type('Test Dataset Title')
      .should('have.attr', 'required', 'required')
      .and('have.value', 'Test Dataset Title')

    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Form Submitted!')
  })
})
