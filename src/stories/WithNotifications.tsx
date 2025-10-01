import { StoryFn } from '@storybook/react'
import { NotificationProvider } from '@/notifications/context/NotificationsContext'
import { NotificationMockRepository } from '@/stories/account/NotificationMockRepository'

export const WithNotifications = (Story: StoryFn) => {
  return (
    <NotificationProvider repository={new NotificationMockRepository()}>
      <Story />
    </NotificationProvider>
  )
}
