import { Meta, StoryObj } from '@storybook/react'
import { ErrorPage } from '@/sections/error-page/ErrorPage'
import { WithI18next } from '../WithI18next'

const meta: Meta<typeof ErrorPage> = {
  title: 'Pages/ErrorPage',
  component: ErrorPage,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof ErrorPage>

export const Default: Story = {
  render: () => <ErrorPage />
}
