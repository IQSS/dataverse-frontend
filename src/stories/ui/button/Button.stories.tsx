import type { Meta, StoryObj } from '@storybook/react'
import { Button } from '../../../sections/ui/button/Button'

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button
}

export default meta
type Story = StoryObj<typeof Button>

export const Primary: Story = {
  render: () => <Button label="Button" />
}

export const Secondary: Story = {
  render: () => <Button secondary label="Button" />
}

export const Large: Story = {
  render: () => <Button size="large" label="Button" />
}

export const Small: Story = {
  render: () => <Button size="small" label="Button" />
}
