import type { Meta, StoryObj } from '@storybook/react'
import { DropdownButton } from '../../../sections/ui/dropdown-button/DropdownButton'

const meta: Meta<typeof DropdownButton> = {
  title: 'UI/Dropdown Button',
  component: DropdownButton
}

export default meta
type Story = StoryObj<typeof DropdownButton>

export const Default: Story = {
  render: () => (
    <DropdownButton title="Dropdown Button" id="dropdown-id" variant="primary">
      <span>Item 1</span>
      <span>Item 2</span>
    </DropdownButton>
  )
}
