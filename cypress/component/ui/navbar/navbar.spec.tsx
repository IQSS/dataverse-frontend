import { Navbar } from '../../../../src/sections/ui/navbar/Navbar'

const brand = {
  logoImgSrc: '/logo.svg',
  title: 'Brand Title',
  href: '/home'
}

describe('Navbar component', () => {
  it('renders the brand logo and title', () => {
    cy.customMount(<Navbar brand={brand} />)

    cy.findByRole('img', { name: 'Brand Logo Image' }).should('exist')
    cy.findByText('Brand Title').should('exist')
  })

  it('renders the navbar links', () => {
    cy.customMount(
      <Navbar brand={brand}>
        <Navbar.Link href="/link-1">Link 1</Navbar.Link>
        <Navbar.Link href="/link-2">Link 2</Navbar.Link>
        <Navbar.Dropdown title="Dropdown" id="dropdown">
          <Navbar.Dropdown.Item href="/item-1">Item 1</Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item href="/item-2">Item 2</Navbar.Dropdown.Item>
        </Navbar.Dropdown>
      </Navbar>
    )

    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    cy.findByRole('link', { name: 'Link 1' }).should('exist')
    cy.findByRole('link', { name: 'Link 2' }).should('exist')

    const dropdownElement = cy.findByRole('button', { name: 'Dropdown' })
    dropdownElement.should('exist')
  })

  it('shows the sublinks when the dropdown is clicked', () => {
    cy.customMount(
      <Navbar brand={brand}>
        <Navbar.Link href="/link-1">Link 1</Navbar.Link>
        <Navbar.Link href="/link-2">Link 2</Navbar.Link>
        <Navbar.Dropdown title="Dropdown" id="dropdown">
          <Navbar.Dropdown.Item href="/item-1">Item 1</Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item href="/item-2">Item 2</Navbar.Dropdown.Item>
        </Navbar.Dropdown>
      </Navbar>
    )
    cy.findByRole('button', { name: 'Toggle navigation' }).click()
    const dropdownElement = cy.findByRole('button', { name: 'Dropdown' })
    dropdownElement.click()

    cy.findByRole('link', { name: 'Item 1' }).should('exist')
    cy.findByRole('link', { name: 'Item 2' }).should('exist')
  })
})
