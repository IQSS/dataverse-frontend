import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { WithLoggedInUser } from '../../../WithLoggedInUser'
import { RequestAccessModal } from '../../../../sections/file/file-action-buttons/access-file-menu/RequestAccessModal'

const meta: Meta<typeof RequestAccessModal> = {
  title: 'Sections/File Page/Action Buttons/RequestAccessModal',
  component: RequestAccessModal,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof RequestAccessModal>

export const LoggedOut: Story = {
  render: () => <RequestAccessModal fileId={1} />
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => <RequestAccessModal fileId={1} />
}
