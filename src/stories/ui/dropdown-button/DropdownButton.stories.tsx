import type { Meta, StoryObj } from '@storybook/react'
import { DropdownButton } from '../../../sections/ui/dropdown-button/DropdownButton'
import { DropdownButtonItem } from '../../../sections/ui/dropdown-button/dropdown-button-item/DropdownButtonItem'
import { Icon } from '../../../sections/ui/icon.enum'

const meta: Meta<typeof DropdownButton> = {
  title: 'UI/Dropdown Button',
  component: DropdownButton
}

export default meta
type Story = StoryObj<typeof DropdownButton>

export const Default: Story = {
  render: () => (
    <DropdownButton withSpacing title="Dropdown Button" id="dropdown-1">
      <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
      <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
      <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
    </DropdownButton>
  )
}

export const Variants: Story = {
  render: () => (
    <>
      <DropdownButton withSpacing title="Primary" id="dropdown-1" variant="primary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
      <DropdownButton withSpacing title="Secondary" id="dropdown-2" variant="secondary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
      <DropdownButton withSpacing title="Tertiary" id="dropdown-3" variant="tertiary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </>
  )
}

export const Primary: Story = {
  render: () => (
    <>
      <DropdownButton title="Primary" id="dropdown-primary" variant="primary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </>
  )
}

export const Secondary: Story = {
  render: () => (
    <>
      <DropdownButton title="Secondary" id="dropdown-secondary" variant="secondary">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </>
  )
}

export const WithIcon: Story = {
  render: () => (
    <DropdownButton
      withSpacing
      title="Dropdown Button"
      id="dropdown-with-icon"
      variant="primary"
      icon={Icon.COLLECTION}>
      <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
      <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
      <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
    </DropdownButton>
  )
}

export const Navigation: Story = {
  render: () => (
    <DropdownButton withSpacing title="Edit" id="dropdown-navigation" variant="primary">
      <DropdownButtonItem href="/users/edit">Users</DropdownButtonItem>
      <DropdownButtonItem href="/products/edit">Products</DropdownButtonItem>
    </DropdownButton>
  )
}
