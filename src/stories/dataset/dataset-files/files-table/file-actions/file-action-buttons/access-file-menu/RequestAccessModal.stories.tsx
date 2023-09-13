import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../../WithI18next'
import { WithSettings } from '../../../../../../WithSettings'
import { RequestAccessModal } from '../../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/access-file-menu/RequestAccessModal'
import { WithLoggedInUser } from '../../../../../../WithLoggedInUser'

const meta: Meta<typeof RequestAccessModal> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileActionButtons/RequestAccessModal',
  component: RequestAccessModal,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof RequestAccessModal>

export const LoggedOut: Story = {
  render: () => <RequestAccessModal fileId={'file-id'} />
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => <RequestAccessModal fileId={'file-id'} />
}
