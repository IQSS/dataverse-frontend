import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../WithI18next'
import { WithSettings } from '../../../../../WithSettings'
import { EditFilesMenu } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesMenu'
import { WithLoggedInUser } from '../../../../../WithLoggedInUser'
import { WithDatasetAllPermissionsGranted } from '../../../../WithDatasetAllPermissionsGranted'
import { FilePreviewMother } from '../../../../../../../tests/component/files/domain/models/FilePreviewMother'
import { FileMockRepository } from '@/stories/file/FileMockRepository'
import { DatasetMockRepository } from '@/stories/dataset/DatasetMockRepository'

const meta: Meta<typeof EditFilesMenu> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/EditFilesMenu',
  component: EditFilesMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser, WithDatasetAllPermissionsGranted]
}

export default meta
type Story = StoryObj<typeof EditFilesMenu>

export const Default: Story = {
  render: () => (
    <EditFilesMenu
      files={FilePreviewMother.createMany(2)}
      fileSelection={{}}
      fileRepository={new FileMockRepository()}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}
