import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { EditFileMenu } from '@/sections/file/file-action-buttons/edit-file-menu/EditFileMenu'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { FileMockRepository } from '../../FileMockRepository'

const storyFile = FileMother.createRealistic()

const meta: Meta<typeof EditFileMenu> = {
  title: 'Sections/File Page/Action Buttons/EditFileMenu',
  component: EditFileMenu,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof EditFileMenu>

export const Default: Story = {
  render: () => (
    <EditFileMenu
      fileId={storyFile.id}
      fileRepository={new FileMockRepository()}
      isRestricted={false}
      datasetInfo={{
        persistentId: storyFile.datasetPersistentId,
        releasedVersionExists: false
      }}
    />
  )
}
