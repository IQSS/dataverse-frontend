import type { Meta, StoryObj } from '@storybook/react'
import { DropdownButton } from '../../../sections/ui/dropdown-button/DropdownButton'
import { DropdownButtonItem } from '../../../sections/ui/dropdown-button/dropdown-button-item/DropdownButtonItem'

const meta: Meta<typeof DropdownButton> = {
  title: 'UI/Dropdown Button',
  component: DropdownButton
}

export default meta
type Story = StoryObj<typeof DropdownButton>

export const Default: Story = {
  render: () => (
    <DropdownButton title="Dropdown Button" id="dropdown-id" variant="primary">
      <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
      <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
      <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
    </DropdownButton>
  )
}
