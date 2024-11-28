import { Meta, StoryObj } from '@storybook/react'
import { Account } from '@/sections/account/Account'
import { WithI18next } from '@/stories/WithI18next'
import { WithLayout } from '@/stories/WithLayout'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { AccountHelper } from '@/sections/account/AccountHelper'
import { UserMockRepository } from '../UserMockRepository'
import { UserMockLoadingRepository } from '../UserMockLoadingRepository'
import { UserMockErrorRepository } from '../UserMockErrorRepository'

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
    />
  )
}

export const Loading: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
      userRepository={new UserMockLoadingRepository()}
    />
  )
}

export const Error: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
      userRepository={new UserMockErrorRepository()}
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
      />
    )
  }
}
