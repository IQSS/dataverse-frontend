import type { StoryObj, Meta } from '@storybook/react'
import { SignUpSuccess } from '@/sections/sign-up/builtin-sign-up-form/SignUpSuccess'
import { WithI18next } from '../WithI18next'
import { WithOIDCAuthContext } from '../WithOIDCAuthContext'

const meta: Meta<typeof SignUpSuccess> = {
  title: 'Sections/Sign Up/Sign Up Success',
  component: SignUpSuccess,
  decorators: [WithI18next, WithOIDCAuthContext]
}
export default meta
type Story = StoryObj<typeof SignUpSuccess>

export const CreatedAndLoggedIn: Story = {
  args: { result: { status: 'created', identifier: '@alovelace' }, isLoggedIn: true }
}

export const CreatedButNotLoggedIn: Story = {
  args: { result: { status: 'created', identifier: '@alovelace' }, isLoggedIn: false }
}

export const PendingEmailConfirmation: Story = {
  args: { result: { status: 'pending' }, isLoggedIn: false }
}
