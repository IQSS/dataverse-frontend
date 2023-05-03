import { DropdownButtonItem } from '../../../../../src/sections/ui/dropdown-button/dropdown-button-item/DropdownButtonItem'

describe('DropdownButtonItem', () => {
  it('renders the provided children', () => {
    cy.customMount(
      <DropdownButtonItem href="/path">
        <span>My Dropdown Item</span>
      </DropdownButtonItem>
    )
    cy.findByText('My Dropdown Item').should('be.visible')
  })

  it('renders the provided href', () => {
    cy.customMount(
      <DropdownButtonItem href="/path">
        <span>My Dropdown Item</span>
      </DropdownButtonItem>
    )
    cy.findByRole('link').should('have.attr', 'href').and('eq', '/path')
  })
})
