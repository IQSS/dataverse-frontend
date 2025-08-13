import { DropdownButtonItem } from '../../../../src/lib/components/dropdown-button/dropdown-button-item/DropdownButtonItem'

describe('DropdownButtonItem', () => {
  it('renders the provided children', () => {
    cy.mount(
      <DropdownButtonItem href="/path">
        <span>My Dropdown Item</span>
      </DropdownButtonItem>
    )
    cy.findByText('My Dropdown Item').should('be.visible')
  })

  it('renders the provided href', () => {
    cy.mount(
      <DropdownButtonItem href="/path">
        <span>My Dropdown Item</span>
      </DropdownButtonItem>
    )
    cy.findByRole('link').should('have.attr', 'href').and('eq', '/path')
  })

  it('renders with the disabled attribute', () => {
    cy.mount(
      <DropdownButtonItem disabled>
        <span>My Dropdown Item</span>
      </DropdownButtonItem>
    )
    cy.findByRole('button').should('have.class', 'disabled')
  })
})
