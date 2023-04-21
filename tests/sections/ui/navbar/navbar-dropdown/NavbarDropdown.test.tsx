import { fireEvent, render } from '@testing-library/react'
import { NavbarDropdown } from '../../../../../src/sections/ui/navbar/navbar-dropdown/NavbarDropdown'
import { Navbar } from '../../../../../src/sections/ui/navbar/Navbar'

describe('NavbarDropdown component', () => {
  const testDummyOnClickHandler = () => {}

  test('renders the dropdown title', () => {
    const { getByRole } = render(
      <NavbarDropdown title="Dropdown Title" id="dropdown">
        <Navbar.Dropdown.Item onClickHandler={testDummyOnClickHandler}>Item 1</Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item onClickHandler={testDummyOnClickHandler}>Item 2</Navbar.Dropdown.Item>
      </NavbarDropdown>
    )

    const titleElement = getByRole('button', { name: 'Dropdown Title' })
    expect(titleElement).toBeInTheDocument()
  })

  test('renders the dropdown links', async () => {
    const { getByRole, findByRole } = render(
      <NavbarDropdown title="Dropdown Title" id="dropdown">
        <Navbar.Dropdown.Item onClickHandler={testDummyOnClickHandler}>Link 1</Navbar.Dropdown.Item>
        <Navbar.Dropdown.Item onClickHandler={testDummyOnClickHandler}>Link 2</Navbar.Dropdown.Item>
        <NavbarDropdown title="Link 3" id="dropdown-2">
          <Navbar.Dropdown.Item onClickHandler={testDummyOnClickHandler}>
            Item 1
          </Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item onClickHandler={testDummyOnClickHandler}>
            Item 2
          </Navbar.Dropdown.Item>
        </NavbarDropdown>
      </NavbarDropdown>
    )

    const dropdownTitle = getByRole('button', { name: 'Dropdown Title' })

    fireEvent.click(dropdownTitle)

    const link1Element = await findByRole('button', { name: 'Link 1' })
    expect(link1Element).toBeInTheDocument()

    const link2Element = await findByRole('button', { name: 'Link 2' })
    expect(link2Element).toBeInTheDocument()

    const link3Element = await findByRole('button', { name: 'Link 3' })
    expect(link3Element).toBeInTheDocument()

    fireEvent.click(link3Element)

    const sublink1Element = await findByRole('button', { name: 'Item 1' })
    expect(sublink1Element).toBeInTheDocument()

    const sublink2Element = await findByRole('button', { name: 'Item 2' })
    expect(sublink2Element).toBeInTheDocument()
  })
})
