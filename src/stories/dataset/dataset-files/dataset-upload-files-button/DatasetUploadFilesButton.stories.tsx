import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { DatasetUploadFilesButton } from '../../../../sections/dataset/dataset-files/dataset-upload-files-button/DatasetUploadFilesButton'
import { WithLoggedInUser } from '../../../WithLoggedInUser'

const meta: Meta<typeof DatasetUploadFilesButton> = {
  title: 'Sections/Dataset Page/DatasetFiles/DatasetUploadFilesButton',
  component: DatasetUploadFilesButton,
  decorators: [WithI18next, WithSettings, WithLoggedInUser]
}

export default meta
type Story = StoryObj<typeof DatasetUploadFilesButton>

export const Default: Story = {
  render: () => <DatasetUploadFilesButton />
}

// TODO - Implement dataset locked from edits
// export const DatasetLockedFromEdits: Story = {
//   render: () => <DatasetUploadFilesButton />
// }
