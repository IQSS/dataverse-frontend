import { Meta, StoryObj } from '@storybook/react'
import { FileOptionsMenu } from '../../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/FileOptionsMenu'
import { WithI18next } from '../../../../../../WithI18next'
import { WithSettings } from '../../../../../../WithSettings'
import { WithLoggedInUser } from '../../../../../../WithLoggedInUser'
import { WithFilePermissionsGranted } from '../../../../../../files/file-permission/WithFilePermissionsGranted'
import { FileMother } from '../../../../../../../../tests/component/files/domain/models/FileMother'

const meta: Meta<typeof FileOptionsMenu> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileActionButtons/FileOptionsMenu',
  component: FileOptionsMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser, WithFilePermissionsGranted]
}

export default meta
type Story = StoryObj<typeof FileOptionsMenu>

export const DefaultWithLoggedInUser: Story = {
  render: () => <FileOptionsMenu file={FileMother.createDefault()} />
}

export const Restricted: Story = {
  render: () => <FileOptionsMenu file={FileMother.createWithRestrictedAccess()} />
}

// TODO - add more stories when values are not hardcoded
// export const WithDatasetLockedFromEdits: Story = {
//   render: () => <FileOptionsMenu file={FileMother.createDefault()} />
// }

export const WithFileAlreadyDeleted: Story = {
  render: () => <FileOptionsMenu file={FileMother.createDeleted()} />
}

//
// export const WithEmbargoAllowed: Story = {
//   render: () => <FileOptionsMenu file={FileMother.createDefault()} />
// }
//
// export const WithProvenanceEnabled: Story = {
//   render: () => <FileOptionsMenu file={FileMother.createDefault()} />
// }
