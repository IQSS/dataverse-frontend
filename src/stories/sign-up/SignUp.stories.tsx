import type { StoryObj, Meta } from '@storybook/react'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { SignUp } from '@/sections/sign-up/SignUp'
// import { WithOIDCAuthContext } from '../WithOIDCAuthContext'
// import { UserMockRepository } from '../shared-mock-repositories/user/UserMockRepository'

const meta: Meta<typeof SignUp> = {
  title: 'Pages/Sign Up',
  component: SignUp,
  decorators: [WithI18next, WithLayout],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof SignUp>

export const ValidTokenWithNotLinkedAccount: Story = {
  render: () => (
    <div>holo</div>
    // <SignUp userRepository={new UserMockRepository()} hasValidTokenButNotLinkedAccount />
  )
}
