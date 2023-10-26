import { Meta, StoryObj } from '@storybook/react'
import { EditFilesMenu } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesMenu'
import { WithI18next } from '../../../../../WithI18next'
import { WithSettings } from '../../../../../WithSettings'
import { WithLoggedInUser } from '../../../../../WithLoggedInUser'
import { WithDatasetAllPermissionsGranted } from '../../../../WithDatasetAllPermissionsGranted'
import { FileMother } from '../../../../../../../tests/component/files/domain/models/FileMother'
import { DownloadFilesButton } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/download-files/DownloadFilesButton'

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
      files={FileMother.createMany(2, { tabularData: undefined })}
      fileSelection={{}}
    />
  )
}

export const TabularFiles: Story = {
  render: () => (
    <DownloadFilesButton
      files={FileMother.createMany(2, {
        tabularData: {
          variablesCount: 2,
          observationsCount: 3,
          unf: 'some-unf'
        }
      })}
      fileSelection={{}}
    />
  )
}
