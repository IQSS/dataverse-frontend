import { Meta, StoryObj } from '@storybook/react'
import { Account } from '@/sections/account/Account'
import { WithI18next } from '@/stories/WithI18next'
import { WithLayout } from '@/stories/WithLayout'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { AccountHelper } from '@/sections/account/AccountHelper'
import { UserMockRepository } from '../../shared-mock-repositories/user/UserMockRepository'
import { CollectionMockRepository } from '../../collection/CollectionMockRepository'
import { RoleMockRepository } from '@/stories/account/RoleMockRepository'
import { NotificationMockRepository } from '@/stories/account/NotificationMockRepository'
import { UserMockErrorRepository } from '@/stories/shared-mock-repositories/user/UserMockErrorRepository'
import { NotificationErrorMockRepository } from '@/stories/account/NotificationErrorMockRepository'

const meta: Meta<typeof Account> = {
  title: 'Sections/Account Page/NotificationsSection',
  component: Account,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Account>

export const Default: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications}
      userRepository={new UserMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      roleRepository={new RoleMockRepository()}
      notificationRepository={new NotificationMockRepository()}
    />
  )
}
export const Error: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications}
      userRepository={new UserMockErrorRepository()}
      collectionRepository={new CollectionMockRepository()}
      roleRepository={new RoleMockRepository()}
      notificationRepository={new NotificationErrorMockRepository()}
    />
  )
}
