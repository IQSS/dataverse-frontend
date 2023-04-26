import { fireEvent, render } from '@testing-library/react'
import { NavDropdown } from '../../../../../../src/sections/ui/navbar/nav-dropdown/NavDropdown'

const links = [
  { title: 'Link 1', value: '/link1' },
  { title: 'Link 2', value: '/link2' },
  {
    title: 'Link 3',
    value: [
      { title: 'Sublink 1', value: '/sublink1' },
      { title: 'Sublink 2', value: '/sublink2' }
    ]
  }
]

describe('NavDropdown component', () => {
  test('renders the dropdown title', () => {
    const { getByRole } = render(<NavDropdown title="Dropdown Title" links={links} />)

    const titleElement = getByRole('button', { name: 'Dropdown Title' })
    expect(titleElement).toBeInTheDocument()
  })

  test('renders the dropdown links', async () => {
    const { getByRole, findByRole } = render(<NavDropdown title="Dropdown Title" links={links} />)

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
