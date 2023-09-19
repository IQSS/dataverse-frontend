import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../../../../WithI18next'
import { WithSettings } from '../../../../../../WithSettings'
import { FileMother } from '../../../../../../../../tests/component/files/domain/models/FileMother'
import { EditFilesMenu } from '../../../../../../../sections/dataset/dataset-files/files-table/file-actions/edit-files-menu/EditFilesMenu'
import { WithLoggedInUser } from '../../../../../../WithLoggedInUser'

const meta: Meta<typeof EditFilesMenu> = {
  title: 'Sections/Dataset Page/DatasetFiles/FilesTable/EditFilesMenu',
  component: EditFilesMenu,
  decorators: [WithI18next, WithSettings, WithLoggedInUser]
}

export default meta
type Story = StoryObj<typeof EditFilesMenu>

export const Default: Story = {
  render: () => <EditFilesMenu files={FileMother.createMany(2)} />
}
