import AddDataActionsButton from '../../../../../src/sections/shared/add-data-actions/AddDataActionsButton'

describe('AddDataActionsButton', () => {
  it('renders the button', () => {
    cy.customMount(<AddDataActionsButton canAddCollection={true} canAddDataset={true} />)

    cy.findByRole('button', { name: /Add Data/i }).should('exist')
    cy.findByRole('button', { name: /Add Data/ }).click()
    cy.findByText('New Collection').should('be.visible')
    cy.findByText('New Dataset').should('be.visible')
  })

  it('renders the new dataset button with the correct generated link', () => {
    cy.customMount(<AddDataActionsButton canAddCollection={true} canAddDataset={true} />)

    cy.findByRole('button', { name: /Add Data/i }).click()
    cy.findByText('New Dataset')
      .should('be.visible')
      .should('have.attr', 'href', '/datasets/create')
  })

  it('renders the new dataset button with the correct generated link', () => {
    const collectionId = 'some-collection-id'
    cy.customMount(
      <AddDataActionsButton
        collectionId={collectionId}
        canAddCollection={true}
        canAddDataset={true}
      />
    )

    cy.findByRole('button', { name: /Add Data/i }).click()
    cy.findByText('New Dataset')
      .should('be.visible')
      .should('have.attr', 'href', `/datasets/create?collectionId=${collectionId}`)
  })

  it('shows New Collection button enabled if user has permissions to create collection', () => {
    cy.customMount(<AddDataActionsButton canAddCollection={true} canAddDataset={true} />)

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Collection' })
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'false')
  })

  it('shows New Dataset button enabled if user has permissions to create dataset', () => {
    cy.customMount(<AddDataActionsButton canAddCollection={true} canAddDataset={true} />)

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Dataset' })
      .should('be.visible')
      .should('not.have.attr', 'aria-disabled', 'true')
  })

  it('shows New Collection button disabled if user does not have permissions to create collection', () => {
    cy.customMount(<AddDataActionsButton canAddCollection={false} canAddDataset={true} />)

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Collection' })
      .should('be.visible')
      .should('have.attr', 'aria-disabled', 'true')
  })

  it('shows New Dataset button disabled if user does not have permissions to create dataset', () => {
    cy.customMount(<AddDataActionsButton canAddCollection={true} canAddDataset={false} />)

    cy.findByRole('button', { name: /Add Data/i }).as('addDataBtn')
    cy.get('@addDataBtn').should('exist')
    cy.get('@addDataBtn').click()
    cy.findByRole('link', { name: 'New Dataset' })
      .should('be.visible')
      .should('have.attr', 'aria-disabled', 'true')
  })
})
