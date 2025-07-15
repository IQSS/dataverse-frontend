import { Meta, StoryObj } from '@storybook/react'
import { Account } from '../../sections/account/Account'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { AccountHelper } from '../../sections/account/AccountHelper'
import { UserMockRepository } from '../shared-mock-repositories/user/UserMockRepository'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { RoleMockRepository } from '@/stories/account/RoleMockRepository'

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

export const Default: Story = {
  render: () => (
    <Account
      defaultActiveTabKey={AccountHelper.ACCOUNT_PANEL_TABS_KEYS.myData}
      userRepository={new UserMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      roleRepository={new RoleMockRepository()}
    />
  )
}
