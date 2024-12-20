import { Meta, StoryObj } from '@storybook/react'
import { Account } from '../../sections/account/Account'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { AccountHelper } from '../../sections/account/AccountHelper'
import { UserMockRepository } from '../shared-mock-repositories/user/UserMockRepository'

const meta: Meta<typeof Account> = {
  title: 'Pages/Account',
  component: Account,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Account>

export const AccountInformation: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.accountInformation}
      userRepository={new UserMockRepository()}
    />
  )
}

export const ApiTokenTab: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.apiToken}
      userRepository={new UserMockRepository()}
    />
  )
}
