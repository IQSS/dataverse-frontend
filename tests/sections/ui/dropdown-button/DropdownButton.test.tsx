import { fireEvent, render } from '@testing-library/react'
import { DropdownButton } from '../../../../src/sections/ui/dropdown-button/DropdownButton'
import styles from '../../../../src/sections/ui/dropdown-button/DropdownButton.module.scss'

const titleText = 'My Dropdown Button'

describe('DropdownButton', () => {
  it('renders the provided title', () => {
    const { getByText } = render(
      <DropdownButton id="my-dropdown" title={titleText} variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    expect(getByText(titleText)).toBeInTheDocument()
  })

  it('renders the provided children', async () => {
    const { getByText, findByText } = render(
      <DropdownButton id="my-dropdown" title="My Dropdown Button" variant="primary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )

    const dropdownButton = getByText(titleText)

    fireEvent.click(dropdownButton)

    const item1 = await findByText('Item 1')
    expect(item1).toBeInTheDocument()

    const item2 = await findByText('Item 2')
    expect(item2).toBeInTheDocument()
  })

  it('applies the correct style classes based on the variant prop', () => {
    const { getByText } = render(
      <DropdownButton id="my-dropdown" title="My Dropdown Button" variant="secondary">
        <span>Item 1</span>
        <span>Item 2</span>
      </DropdownButton>
    )
    const dropdownButton = getByText(titleText)

    expect(dropdownButton.parentNode).toHaveClass(styles.secondary)
  })
})
