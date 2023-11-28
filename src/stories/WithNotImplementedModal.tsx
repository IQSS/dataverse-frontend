import { StoryFn } from '@storybook/react'
import { NotImplementedModalProvider } from '../sections/not-implemented/NotImplementedModalProvider'

export const WithNotImplementedModal = (Story: StoryFn) => {
  return (
    <NotImplementedModalProvider>
      <Story />
    </NotImplementedModalProvider>
  )
}
