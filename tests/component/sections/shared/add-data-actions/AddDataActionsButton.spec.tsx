import AddDataActionsButton from '../../../../../src/sections/shared/add-data-actions/AddDataActionsButton'

describe('AddDataActionsButton', () => {
  it('renders the button', () => {
    cy.customMount(<AddDataActionsButton />)

    cy.findByRole('button', { name: /Add Data/i }).should('exist')
    cy.findByRole('button', { name: /Add Data/ }).click()
    cy.findByText('New Collection').should('be.visible')
    cy.findByText('New Dataset').should('be.visible')
  })

  it('renders the new dataset button with the correct generated link', () => {
    cy.customMount(<AddDataActionsButton />)

    cy.findByRole('button', { name: /Add Data/i }).click()
    cy.findByText('New Dataset')
      .should('be.visible')
      .should('have.attr', 'href', '/datasets/create')
  })

  it('renders the new dataset button with the correct generated link', () => {
    const collectionId = 'some-collection-id'
    cy.customMount(<AddDataActionsButton collectionId={collectionId} />)

    cy.findByRole('button', { name: /Add Data/i }).click()
    cy.findByText('New Dataset')
      .should('be.visible')
      .should('have.attr', 'href', `/datasets/create?collectionId=${collectionId}`)
  })
})
