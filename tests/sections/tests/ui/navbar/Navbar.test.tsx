import { render, fireEvent } from '@testing-library/react'
import { Navbar } from '../../../../../src/sections/ui/navbar/Navbar'

const brand = {
  logo: { src: 'logo.png', altText: 'Logo Alt Text' },
  title: 'Brand Title',
  path: '/home'
}

const links = [
  { title: 'Link 1', value: '/link1' },
  { title: 'Link 2', value: '/link2' },
  {
    title: 'Dropdown',
    value: [
      { title: 'Sublink 1', value: '/sublink1' },
      { title: 'Sublink 2', value: '/sublink2' }
    ]
  }
]

describe('Navbar component', () => {
  test('renders the brand logo and title', () => {
    const { getByRole } = render(<Navbar brand={brand} links={[]} />)

    const logoImage = getByRole('img', { name: 'Logo Alt Text' })
    expect(logoImage).toBeInTheDocument()

    const brandElement = getByRole('link', { name: 'Logo Alt Text Brand Title' })
    expect(brandElement).toBeInTheDocument()
  })

  test('renders the navbar links', () => {
    const { getByRole } = render(<Navbar brand={brand} links={links} />)

    const link1Element = getByRole('link', { name: 'Link 1' })
    expect(link1Element).toBeInTheDocument()

    const link2Element = getByRole('link', { name: 'Link 2' })
    expect(link2Element).toBeInTheDocument()

    const dropdownElement = getByRole('button', { name: 'Dropdown' })
    expect(dropdownElement).toBeInTheDocument()
  })

  test('shows the sublinks when the dropdown is clicked', async () => {
    const { getByRole, findByRole } = render(<Navbar brand={brand} links={links} />)

    const dropdownElement = getByRole('button', { name: 'Dropdown' })

    fireEvent.click(dropdownElement)

    const sublink1Element = await findByRole('link', { name: 'Sublink 1' })
    expect(sublink1Element).toBeInTheDocument()

    const sublink2Element = await findByRole('link', { name: 'Sublink 2' })
    expect(sublink2Element).toBeInTheDocument()
  })
})
