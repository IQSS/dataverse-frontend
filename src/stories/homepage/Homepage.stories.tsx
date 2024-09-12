import { Meta, StoryObj } from '@storybook/react'
import Homepage from '../../sections/homepage/Homepage'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'

const meta: Meta<typeof Homepage> = {
  title: 'Pages/Home',
  component: Homepage,
  decorators: [WithI18next, WithLayout],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Homepage>

export const Default: Story = {
  render: () => <Homepage />
}
