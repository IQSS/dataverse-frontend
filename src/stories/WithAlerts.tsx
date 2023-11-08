import { StoryFn } from '@storybook/react'
import { DatasetAlertProvider } from '../sections/dataset/DatasetAlertProvider'

export const WithAlerts = (Story: StoryFn) => {
  return (
    <DatasetAlertProvider>
      <Story />
    </DatasetAlertProvider>
  )
}
