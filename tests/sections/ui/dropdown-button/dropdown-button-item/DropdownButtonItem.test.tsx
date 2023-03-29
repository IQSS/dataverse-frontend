import { render } from '@testing-library/react'
import { DropdownButtonItem } from '../../../../../src/sections/ui/dropdown-button/dropdown-button-item/DropdownButtonItem'

describe('DropdownButtonItem', () => {
  it('renders the provided children', () => {
    const { getByText } = render(
      <DropdownButtonItem href="/path">
        <span>My Dropdown Item</span>
      </DropdownButtonItem>
    )
    expect(getByText('My Dropdown Item')).toBeInTheDocument()
  })

  it('renders the provided href', () => {
    const { getByRole } = render(
      <DropdownButtonItem href="/path">
        <span>My Dropdown Item</span>
      </DropdownButtonItem>
    )
    const link = getByRole('link')
    expect(link).toHaveAttribute('href', '/path')
  })
})
