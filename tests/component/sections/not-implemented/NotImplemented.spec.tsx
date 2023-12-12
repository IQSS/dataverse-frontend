import { NotImplementedModal } from '../../../../src/sections/not-implemented/NotImplementedModal'
import { mount } from 'cypress/react18'

describe('NotImplementedModal Component', () => {
  it('renders the modal when show is true', () => {
    // Mount the component with show set to true
    mount(<NotImplementedModal show={true} handleClose={() => {}} />)

    // Check if the modal title is present
    cy.findByText('Not Implemented').should('exist')

    // Check if the modal body has specific content
    cy.findByText('This feature is not implemented yet in SPA.').should('exist')
  })

  it('closes the modal when the Close button is clicked', () => {
    // A spy to check if handleClose is called
    const handleClose = cy.spy().as('handleClose')

    // Mount the component with the spy as the handleClose prop
    mount(<NotImplementedModal show={true} handleClose={handleClose} />)

    // Click the Close button
    cy.findByText('Close').click()

    // Check if handleClose was called
    cy.get('@handleClose').should('have.been.calledOnce')
  })
})
