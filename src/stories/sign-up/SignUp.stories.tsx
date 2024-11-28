import type { StoryObj, Meta } from '@storybook/react'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { SignUp } from '@/sections/sign-up/SignUp'
import { DataverseInfoMockRepository } from '../shared-mock-repositories/info/DataverseInfoMockRepository'
import { DataverseInfoMockLoadingRepository } from '../shared-mock-repositories/info/DataverseInfoMocLoadingkRepository'
import { WithOIDCAuthContext } from '../WithOIDCAuthContext'

// TODO:ME - After implementing register use case in js-dataverse, we should mock the register function here also.

const meta: Meta<typeof SignUp> = {
  title: 'Pages/Sign Up',
  component: SignUp,
  decorators: [WithI18next, WithLayout, WithOIDCAuthContext],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof SignUp>

export const ValidTokenWithNotLinkedAccount: Story = {
  render: () => (
    <SignUp
      dataverseInfoRepository={new DataverseInfoMockRepository()}
      hasValidTokenButNotLinkedAccount
    />
  )
}

export const Loading: Story = {
  render: () => (
    <SignUp
      dataverseInfoRepository={new DataverseInfoMockLoadingRepository()}
      hasValidTokenButNotLinkedAccount
    />
  )
}
