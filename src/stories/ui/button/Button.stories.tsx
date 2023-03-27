import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../../sections/ui/button/Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  render: () => <Button>Button</Button>
}

export const Secondary: Story = {
  render: () => <Button variant="secondary">Button</Button>
}

export const Tertiary: Story = {
  render: () => <Button variant="tertiary">Button</Button>
}

export const Disabled: Story = {
  render: () => <Button disabled>Button</Button>
}

export const Large: Story = {
  render: () => <Button size="large">Button</Button>
}

export const Small: Story = {
  render: () => <Button size="small">Button</Button>
}
