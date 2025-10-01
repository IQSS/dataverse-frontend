import { Meta, StoryObj } from '@storybook/react'
import { Account } from '@/sections/account/Account'
import { WithI18next } from '@/stories/WithI18next'
import { WithLayout } from '@/stories/WithLayout'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { AccountHelper } from '@/sections/account/AccountHelper'
import { UserMockRepository } from '../../shared-mock-repositories/user/UserMockRepository'
import { CollectionMockRepository } from '../../collection/CollectionMockRepository'
import { RoleMockRepository } from '@/stories/account/RoleMockRepository'
import { NotificationProvider } from '@/notifications/context/NotificationsContext'
import { NotificationMockRepository } from '@/stories/account/NotificationMockRepository'

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
    <NotificationProvider repository={new NotificationMockRepository()}>
      <Account
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.notifications}
        userRepository={new UserMockRepository()}
        collectionRepository={new CollectionMockRepository()}
        roleRepository={new RoleMockRepository()} // No roles in this section
      />
    </NotificationProvider>
  )
}
