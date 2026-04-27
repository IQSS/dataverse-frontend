import { Meta, StoryObj } from '@storybook/react'
import { Account } from '@/sections/account/Account'
import { WithI18next } from '@/stories/WithI18next'
import { WithLayout } from '@/stories/WithLayout'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { AccountHelper } from '@/sections/account/AccountHelper'
import { UserMockRepository } from '../../shared-mock-repositories/user/UserMockRepository'
import { UserMockLoadingRepository } from '../../shared-mock-repositories/user/UserMockLoadingRepository'
import { UserMockErrorRepository } from '../../shared-mock-repositories/user/UserMockErrorRepository'
import { CollectionMockRepository } from '../../collection/CollectionMockRepository'
import { RoleMockRepository } from '@/stories/account/RoleMockRepository'
import { NotificationMockRepository } from '@/stories/account/NotificationMockRepository'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof Account> = {
  title: 'Sections/Account Page/ApiTokenSection',
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
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <Account
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
        userRepository={new UserMockRepository()}
        roleRepository={new RoleMockRepository()}
        notificationRepository={new NotificationMockRepository()}
      />
    </RepositoriesStoryProvider>
  )
}

export const Loading: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <Account
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
        userRepository={new UserMockLoadingRepository()}
        roleRepository={new RoleMockRepository()}
        notificationRepository={new NotificationMockRepository()}
      />
    </RepositoriesStoryProvider>
  )
}

export const Error: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <Account
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
        userRepository={new UserMockErrorRepository()}
        roleRepository={new RoleMockRepository()}
        notificationRepository={new NotificationMockRepository()}
      />
    </RepositoriesStoryProvider>
  )
}

export const NoToken: Story = {
  render: () => {
    const noTokenRepository = new UserMockRepository()
    noTokenRepository.getCurrentApiToken = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            apiToken: '',
            expirationDate: new Date()
          })
        }, 1_000)
      })
    }

    return (
      <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
        <Account
          defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
          userRepository={noTokenRepository}
          roleRepository={new RoleMockRepository()}
          notificationRepository={new NotificationMockRepository()}
        />
      </RepositoriesStoryProvider>
    )
  }
}
