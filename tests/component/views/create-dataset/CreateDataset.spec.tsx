import CreateDatasetContainer from '../../../../src/sections/create-dataset/CreateDatasetContext'

describe('Form component', () => {
  beforeEach(() => {
    cy.customMount(<CreateDatasetContainer />)
  })
  it('can submit a valid form', () => {
    cy.findByText(/Create Dataset/i).should('exist')
    cy.findByText(/Title/i).should('exist')

    cy.get('input[name="createDatasetTitle"]')
      .should('exist')
      .type('Test Dataset Title')
      .should('have.attr', 'required', 'required')
      .and('have.value', 'Test Dataset Title')
    cy.findByText(/Save Dataset/i).should('exist')
    cy.findByText(/Cancel/i).should('exist')
    cy.log('Submit form')
    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Form Submitted!', { timeout: 5000 })
  })
})
