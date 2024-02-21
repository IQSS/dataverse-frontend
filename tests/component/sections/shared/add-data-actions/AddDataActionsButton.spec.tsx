import AddDataActionsButton from '../../../../../src/sections/shared/add-data-actions/AddDataActionsButton'

describe('AddDataActionsButton', () => {
  it('renders the button', () => {
    cy.customMount(<AddDataActionsButton />)

    cy.findByRole('button', { name: /Add Data/i }).should('exist')
  })

  // it('renders the tooltip', () => {  })
})
