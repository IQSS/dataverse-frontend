import { Meta, StoryObj } from '@storybook/react'
import { FileOptionsMenu } from '../../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/FileOptionsMenu'
import { WithI18next } from '../../../../../../WithI18next'
import { WithSettings } from '../../../../../../WithSettings'
import { WithLoggedInUser } from '../../../../../../WithLoggedInUser'
import { FilePreviewMother } from '../../../../../../../../tests/component/files/domain/models/FilePreviewMother'
import { WithDatasetAllPermissionsGranted } from '../../../../../WithDatasetAllPermissionsGranted'
import { WithDatasetLockedFromEdits } from '../../../../../WithDatasetLockedFromEdits'

const meta: Meta<typeof FileOptionsMenu> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileActionButtons/FileOptionsMenu',
  component: FileOptionsMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser]
}

export default meta
type Story = StoryObj<typeof FileOptionsMenu>

export const DefaultWithLoggedInUser: Story = {
  decorators: [WithDatasetAllPermissionsGranted],
  render: () => <FileOptionsMenu file={FilePreviewMother.createDefault()} />
}

export const Restricted: Story = {
  decorators: [WithDatasetAllPermissionsGranted],
  render: () => <FileOptionsMenu file={FilePreviewMother.createWithRestrictedAccess()} />
}

export const WithDatasetLocked: Story = {
  decorators: [WithDatasetLockedFromEdits],
  render: () => <FileOptionsMenu file={FilePreviewMother.createDefault()} />
}

export const WithFileAlreadyDeleted: Story = {
  decorators: [WithDatasetAllPermissionsGranted],
  render: () => <FileOptionsMenu file={FilePreviewMother.createDeleted()} />
}

//
// export const WithEmbargoAllowed: Story = {
//   render: () => <FileOptionsMenu file={FileMother.createDefault()} />
// }
//
// export const WithProvenanceEnabled: Story = {
//   render: () => <FileOptionsMenu file={FileMother.createDefault()} />
// }
