import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { WithLoggedInUser } from '../../../WithLoggedInUser'
import { withAppConfig } from '../../../WithAppConfig'
import { RequestAccessModal } from '../../../../sections/file/file-action-buttons/access-file-menu/RequestAccessModal'

const meta: Meta<typeof RequestAccessModal> = {
  title: 'Sections/File Page/Action Buttons/RequestAccessModal',
  component: RequestAccessModal,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof RequestAccessModal>

export const LoggedOut: Story = {
  decorators: [withAppConfig({ signUpEnabled: false })],
  render: () => <RequestAccessModal fileId={1} />
}

export const LoggedOutWithSignUp: Story = {
  decorators: [withAppConfig({ signUpEnabled: true })],
  render: () => <RequestAccessModal fileId={1} />
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => <RequestAccessModal fileId={1} />
}
