import { StoryFn } from '@storybook/react'
import { AlertProvider } from '../sections/alerts/AlertProvider'

export const WithAlerts = (Story: StoryFn) => {
  return (
    <AlertProvider>
      <Story />
    </AlertProvider>
  )
}
