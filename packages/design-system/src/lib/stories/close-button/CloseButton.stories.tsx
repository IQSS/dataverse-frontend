import type { Meta, StoryObj } from '@storybook/react'
import { CloseButton } from '../../components/close-button/CloseButton'

const meta: Meta<typeof CloseButton> = {
  title: 'CloseButton',
  component: CloseButton
}

export default meta
type Story = StoryObj<typeof CloseButton>

export const Default: Story = {
  render: () => <CloseButton />
}
export const Disabled: Story = {
  render: () => <CloseButton disabled />
}
