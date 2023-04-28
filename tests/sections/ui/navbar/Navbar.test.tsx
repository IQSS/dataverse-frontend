import { render, fireEvent } from '@testing-library/react'
import { Navbar } from '../../../../packages/dataverse-ui-lib/src/lib/navbar/Navbar'

const brand = {
  logoImgSrc: '/logo.svg',
  title: 'Brand Title',
  href: '/home'
}

describe('Navbar component', () => {
  test('renders the brand logo and title', () => {
    const { getByRole } = render(<Navbar brand={brand} />)

    const logoImage = getByRole('img', { name: 'Brand Logo Image' })
    expect(logoImage).toBeInTheDocument()

    const brandElement = getByRole('link', { name: 'Brand Logo Image Brand Title' })
    expect(brandElement).toBeInTheDocument()
  })

  test('renders the navbar links', () => {
    const { getByRole } = render(
      <Navbar brand={brand}>
        <Navbar.Link href="/link-1">Link 1</Navbar.Link>
        <Navbar.Link href="/link-2">Link 2</Navbar.Link>
        <Navbar.Dropdown title="Dropdown" id="dropdown">
          <Navbar.Dropdown.Item href="/sublink-1">Sublink 1</Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item href="/sublink-2">Sublink 2</Navbar.Dropdown.Item>
        </Navbar.Dropdown>
      </Navbar>
    )

    const link1Element = getByRole('link', { name: 'Link 1' })
    expect(link1Element).toBeInTheDocument()

    const link2Element = getByRole('link', { name: 'Link 2' })
    expect(link2Element).toBeInTheDocument()

    const dropdownElement = getByRole('button', { name: 'Dropdown' })
    expect(dropdownElement).toBeInTheDocument()
  })

  test('shows the sublinks when the dropdown is clicked', async () => {
    const { getByRole, findByRole } = render(
      <Navbar brand={brand}>
        <Navbar.Link href="/link-1">Link 1</Navbar.Link>
        <Navbar.Link href="/link-2">Link 2</Navbar.Link>
        <Navbar.Dropdown title="Dropdown" id="dropdown">
          <Navbar.Dropdown.Item href="/sublink-1">Sublink 1</Navbar.Dropdown.Item>
          <Navbar.Dropdown.Item href="/sublink-2">Sublink 2</Navbar.Dropdown.Item>
        </Navbar.Dropdown>
      </Navbar>
    )

    const dropdownElement = getByRole('button', { name: 'Dropdown' })

    fireEvent.click(dropdownElement)

    const sublink1Element = await findByRole('link', { name: 'Sublink 1' })
    expect(sublink1Element).toBeInTheDocument()

    const sublink2Element = await findByRole('link', { name: 'Sublink 2' })
    expect(sublink2Element).toBeInTheDocument()
  })
})
