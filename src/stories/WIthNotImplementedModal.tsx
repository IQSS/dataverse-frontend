import { StoryFn } from '@storybook/react'
import { NotImplementedModalProvider } from '../sections/not-implemented/NotImplementedModalProvider'

export const WIthNotImplementedModal = (Story: StoryFn) => {
  return (
    <NotImplementedModalProvider>
      <Story />
    </NotImplementedModalProvider>
  )
}
