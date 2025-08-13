import type { Meta, StoryObj } from '@storybook/react'
import { ProgressBar } from '../../components/progress-bar/ProgressBar'

const meta: Meta<typeof ProgressBar> = {
  title: 'ProgressBar',
  component: ProgressBar
}

export default meta
type Story = StoryObj<typeof ProgressBar>

export const Default: Story = {
  render: () => <ProgressBar now={30} />
}
