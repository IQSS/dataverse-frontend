import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../WithI18next'
import { WithSettings } from '../../../../../WithSettings'
import { FileMother } from '../../../../../../../tests/component/files/domain/models/FileMother'
import { FileOptionsMenu } from '../../../../../../sections/dataset/dataset-files/files-table/file-actions/file-actions-cell/file-action-buttons/file-options-menu/FileOptionsMenu'

const meta: Meta<typeof FileOptionsMenu> = {
  title:
    'Sections/Dataset Page/DatasetFiles/FilesTable/FileActionsCell/FileActionButtons/FileOptionsMenu',
  component: FileOptionsMenu,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof FileOptionsMenu>

export const Default: Story = {
  render: () => <FileOptionsMenu file={FileMother.createDefault()} />
}
