import type { Meta, StoryObj } from '@storybook/react'
import { DropdownButton } from '../../../sections/ui/dropdown-button/DropdownButton'
import { DropdownButtonItem } from '../../../sections/ui/dropdown-button/dropdown-button-item/DropdownButtonItem'
import { Icon } from '../../../sections/ui/icon.enum'
import { ReactNode } from 'react'

const meta: Meta<typeof DropdownButton> = {
  title: 'UI/Dropdown Button',
  component: DropdownButton
}

export default meta
type Story = StoryObj<typeof DropdownButton>

const Canvas150Height = ({ children }: { children: ReactNode }) => {
  return <div style={{ height: 150 }}>{children}</div>
}

export const Default: Story = {
  render: () => (
    <Canvas150Height>
      <DropdownButton withSpacing title="Dropdown Button" id="dropdown-1">
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </Canvas150Height>
  )
}

export const Variants: Story = {
  render: () => (
    <Canvas150Height>
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
    </Canvas150Height>
  )
}

export const WithIcon: Story = {
  render: () => (
    <Canvas150Height>
      <DropdownButton
        withSpacing
        title="Dropdown Button"
        id="dropdown-1"
        variant="primary"
        icon={Icon.COLLECTION}>
        <DropdownButtonItem href="/item-1">Item 1</DropdownButtonItem>
        <DropdownButtonItem href="/item-2">Item 2</DropdownButtonItem>
        <DropdownButtonItem href="/item-3">Item 3</DropdownButtonItem>
      </DropdownButton>
    </Canvas150Height>
  )
}
