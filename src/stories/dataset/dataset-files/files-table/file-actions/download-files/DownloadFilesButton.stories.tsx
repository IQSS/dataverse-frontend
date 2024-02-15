import { Meta, StoryObj } from '@storybook/react'
import { EditFilesMenu } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesMenu'
import { WithI18next } from '../../../../../WithI18next'
import { WithSettings } from '../../../../../WithSettings'
import { WithLoggedInUser } from '../../../../../WithLoggedInUser'
import { WithDatasetAllPermissionsGranted } from '../../../../WithDatasetAllPermissionsGranted'
import { FileMetadataMother } from '../../../../../../../tests/component/files/domain/models/FileMetadataMother'
import { DownloadFilesButton } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/download-files/DownloadFilesButton'
import { FilePreviewMother } from '../../../../../../../tests/component/files/domain/models/FilePreviewMother'

const meta: Meta<typeof EditFilesMenu> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/DownloadFilesButton',
  component: EditFilesMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser, WithDatasetAllPermissionsGranted]
}

export default meta
type Story = StoryObj<typeof EditFilesMenu>

export const NonTabularFiles: Story = {
  render: () => (
    <DownloadFilesButton
      files={FilePreviewMother.createMany(2, {
        metadata: FileMetadataMother.createWithoutThumbnail()
      })}
      fileSelection={{}}
    />
  )
}

export const TabularFiles: Story = {
  render: () => (
    <DownloadFilesButton
      files={FilePreviewMother.createMany(2, {
        metadata: FileMetadataMother.createTabular()
      })}
      fileSelection={{}}
    />
  )
}
