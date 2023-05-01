import { fireEvent, render } from '@testing-library/react'
import { NavbarDropdown } from '../../../../../packages/dataverse-ui-lib/src/lib/components/navbar/navbar-dropdown/NavbarDropdown'
import { Navbar } from '../../../../../packages/dataverse-ui-lib/src/lib/components/navbar/Navbar'

describe('NavbarDropdown component', () => {
  test('renders the dropdown title', () => {
    const { getByRole } = render(
      <NavbarDropdown title="Dropdown Title" id="dropdown">
        <Navbar.Dropdown.Item href="/link-1">Link 1</Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item href="/link-2">Link 2</Navbar.Dropdown.Item>
      </NavbarDropdown>
    )

    const titleElement = getByRole('button', { name: 'Dropdown Title' })
    expect(titleElement).toBeInTheDocument()
  })

  test('renders the dropdown links', async () => {
    const { getByRole, findByRole } = render(
      <NavbarDropdown title="Dropdown Title" id="dropdown">
        <Navbar.Dropdown.Item href="/link-1">Link 1</Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item href="/link-2">Link 2</Navbar.Dropdown.Item>
        <NavbarDropdown title="Link 3" id="dropdown-2">
          <Navbar.Dropdown.Item href="/sublink-1">Sublink 1</Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item href="/sublink-2">Sublink 2</Navbar.Dropdown.Item>
        </NavbarDropdown>
      </NavbarDropdown>
    )

    const dropdownTitle = getByRole('button', { name: 'Dropdown Title' })

    fireEvent.click(dropdownTitle)

    const link1Element = await findByRole('link', { name: 'Link 1' })
    expect(link1Element).toBeInTheDocument()

    const link2Element = await findByRole('link', { name: 'Link 2' })
    expect(link2Element).toBeInTheDocument()

    const link3Element = await findByRole('button', { name: 'Link 3' })
    expect(link3Element).toBeInTheDocument()

    fireEvent.click(link3Element)

    const sublink1Element = await findByRole('link', { name: 'Sublink 1' })
    expect(sublink1Element).toBeInTheDocument()

    const sublink2Element = await findByRole('link', { name: 'Sublink 2' })
    expect(sublink2Element).toBeInTheDocument()
  })
})
