import CreateDatasetContainer from '../../../../src/sections/create-dataset/CreateDatasetContext'
import { mount } from 'cypress/react18'

describe('Form component', () => {
  // beforeEach(() => {
  //   mount(<CreateDatasetContainer />).then((wrapper) =>
  //     cy.spy(wrapper.component, 'handleCreateDatasetSubmit').as('handleCreateDatasetSubmit')
  //   )
  // })
  it('renders the Create Dataset page and its contents', () => {
    mount(<CreateDatasetContainer />)
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
    mount(<CreateDatasetContainer />)
    // mount(<CreateDatasetContainer />).then((wrapper) => {
    //   cy.spy(wrapper.component, 'handleCreateDatasetSubmit').as('onSubmit')
    //   cy.spy(wrapper.component, 'handleCreateDatasetSubmit')
    // })
    // const spy = cy.spy('CreateDatasetContainer', 'handleCreateDatasetSubmit').as('bar')
    // const withFoo = spy.withArgs('handleCreateDatasetSubmit').as('withFoo')
    // const handleCreateDatasetSubmit = cy.spy().as('handleCreateDatasetSubmit')
    cy.get('input[name="createDatasetTitle"]')
      .should('exist')
      .type('Test Dataset Title')
      .should('have.attr', 'required', 'required')
      .and('have.value', 'Test Dataset Title')

    cy.findByText(/Save Dataset/i).click()
    cy.findByText('Form Submitted!')
    // Check if handleClose was called
    // cy.get('@handleCreateDatasetSubmit').should('have.been.calledOnce')
  })
})
