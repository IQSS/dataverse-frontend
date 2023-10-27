import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { DatasetUploadFilesButton } from '../../../../sections/dataset/dataset-files/dataset-upload-files-button/DatasetUploadFilesButton'
import { WithLoggedInUser } from '../../../WithLoggedInUser'
import { WithDatasetAllPermissionsGranted } from '../../WithDatasetAllPermissionsGranted'

const meta: Meta<typeof DatasetUploadFilesButton> = {
  title: 'Sections/Dataset Page/DatasetFiles/DatasetUploadFilesButton',
  component: DatasetUploadFilesButton,
  decorators: [WithI18next, WithSettings, WithLoggedInUser, WithDatasetAllPermissionsGranted]
}

export default meta
type Story = StoryObj<typeof DatasetUploadFilesButton>

export const Default: Story = {
  render: () => <DatasetUploadFilesButton />
}
