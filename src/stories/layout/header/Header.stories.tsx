import type { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { Header } from '../../../sections/layout/header/Header'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
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
    return (
      <Header
        notificationRepository={new NotificationMockRepository()}
        collectionRepository={new CollectionMockRepository()}
      />
    )
  }
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => {
    return (
      <Header
        notificationRepository={new NotificationMockRepository()}
        collectionRepository={new CollectionMockRepository()}
      />
    )
  }
}
