import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { WithNotifications } from '@/stories/WithNotifications'
import { NotificationProvider } from '@/notifications/context/NotificationsContext'
import { NotificationMockRepository } from '@/stories/account/NotificationMockRepository'

const meta: Meta<typeof Header> = {
  title: 'Layout/Header',
  component: Header,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof Header>

export const LoggedOut: Story = {
  render: () => {
    return <Header collectionRepository={new CollectionMockRepository()} />
  }
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser, WithNotifications],
  render: () => {
    return (
      <NotificationProvider repository={new NotificationMockRepository()}>
        <Header collectionRepository={new CollectionMockRepository()} />
      </NotificationProvider>
    )
  }
}
