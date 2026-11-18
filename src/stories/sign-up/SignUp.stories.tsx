import type { StoryObj, Meta } from '@storybook/react'
import { expect, userEvent, within } from '@storybook/test'
import { withAppConfig } from '../WithAppConfig'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { SignUp } from '@/sections/sign-up/SignUp'
import { WithOIDCAuthContext } from '../WithOIDCAuthContext'
import { UserMockRepository } from '../shared-mock-repositories/user/UserMockRepository'
import { DataverseInfoMockRepository } from '../shared-mock-repositories/info/DataverseInfoMockRepository'
import { DataverseInfoMockLoadingRepository } from '../shared-mock-repositories/info/DataverseInfoMockLoadingkRepository'
import { DataverseInfoMockErrorRepository } from '../shared-mock-repositories/info/DataverseInfoMockErrorRepository'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

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

const withSignUpConfig = (signUpWithOrcidEnabled: boolean) =>
  withAppConfig({ signUpEnabled: true, signUpWithOrcidEnabled })

const renderBuiltinSignUp = () => (
  <RepositoriesStoryProvider userRepository={new UserMockRepository()}>
    <SignUp
      dataverseInfoRepository={new DataverseInfoMockRepository()}
      hasValidTokenButNotLinkedAccount={false}
    />
  </RepositoriesStoryProvider>
)

export const BuiltinSignUp: Story = {
  decorators: [withSignUpConfig(false)],
  render: renderBuiltinSignUp
}

export const BuiltinSignUpWithOrcid: Story = {
  decorators: [withSignUpConfig(true)],
  render: renderBuiltinSignUp
}

export const BuiltinSignUpWithValidationErrors: Story = {
  decorators: [withSignUpConfig(true)],
  render: renderBuiltinSignUp,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(
      await canvas.findByTestId('termsAcceptedCheckbox', undefined, { timeout: 5000 })
    )
    await userEvent.click(canvas.getByRole('button', { name: 'Create Account' }))
    await expect(await canvas.findByText('Username is required.')).toBeInTheDocument()
  }
}

export const ValidTokenWithNotLinkedAccount: Story = {
  render: () => (
    <RepositoriesStoryProvider userRepository={new UserMockRepository()}>
      <SignUp
        dataverseInfoRepository={new DataverseInfoMockRepository()}
        hasValidTokenButNotLinkedAccount
      />
    </RepositoriesStoryProvider>
  )
}

export const LoadingTermsOfUse: Story = {
  render: () => (
    <RepositoriesStoryProvider userRepository={new UserMockRepository()}>
      <SignUp
        dataverseInfoRepository={new DataverseInfoMockLoadingRepository()}
        hasValidTokenButNotLinkedAccount
      />
    </RepositoriesStoryProvider>
  )
}

export const FailedToFetchTermsOfUse: Story = {
  render: () => (
    <RepositoriesStoryProvider userRepository={new UserMockRepository()}>
      <SignUp
        dataverseInfoRepository={new DataverseInfoMockErrorRepository()}
        hasValidTokenButNotLinkedAccount
      />
    </RepositoriesStoryProvider>
  )
}
