import { NavbarDropdown } from '../../../../../src/sections/ui/navbar/navbar-dropdown/NavbarDropdown'
import { Navbar } from '../../../../../src/sections/ui/navbar/Navbar'

describe('NavbarDropdown component', () => {
  test('renders the dropdown title', () => {
    cy.customMount(
      <NavbarDropdown title="Dropdown Title" id="dropdown">
        <Navbar.Dropdown.Item href="/link-1">Link 1</Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item href="/link-2">Link 2</Navbar.Dropdown.Item>
      </NavbarDropdown>
    )
    cy.findByRole('button', { name: 'Dropdown Title' }).should('be.visible')
  })

  test('renders the dropdown links', () => {
    cy.findByRole(
      <NavbarDropdown title="Dropdown Title" id="dropdown">
        <Navbar.Dropdown.Item href="/link-1">Link 1</Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item href="/link-2">Link 2</Navbar.Dropdown.Item>
        <NavbarDropdown title="Link 3" id="dropdown-2">
          <Navbar.Dropdown.Item href="/sublink-1">Sublink 1</Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item href="/sublink-2">Sublink 2</Navbar.Dropdown.Item>
        </NavbarDropdown>
      </NavbarDropdown>
    )

    cy.findByRole('button', { name: 'Dropdown Title' }).click()
    cy.findByRole('link', { name: 'Link 1' }).should('be.visible')
    cy.findByRole('link', { name: 'Link 2' }).should('be.visible')
    cy.findByRole('button', { name: 'Link 3' }).should('be.visible')

    cy.findByRole('button', { name: 'Link 3' }).click()
    cy.findByRole('link', { name: 'Sublink 1' }).should('be.visible')
    cy.findByRole('link', { name: 'Sublink 2' }).should('be.visible')
  })
})
