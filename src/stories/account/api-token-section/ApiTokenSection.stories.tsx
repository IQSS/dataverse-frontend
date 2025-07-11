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
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
      userRepository={new UserMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      roleRepository={new RoleMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
      userRepository={new UserMockLoadingRepository()}
      collectionRepository={new CollectionMockRepository()}
      roleRepository={new RoleMockRepository()}
    />
  )
}

export const Error: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
      userRepository={new UserMockErrorRepository()}
      collectionRepository={new CollectionMockRepository()}
      roleRepository={new RoleMockRepository()}
    />
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
      <Account
        defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
        userRepository={noTokenRepository}
        collectionRepository={new CollectionMockRepository()}
        roleRepository={new RoleMockRepository()}
      />
    )
  }
}
