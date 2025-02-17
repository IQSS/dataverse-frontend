import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../../WithI18next'
import { WithSettings } from '../../../WithSettings'
import { EditFileDropdown } from '@/sections/file/file-action-buttons/edit-file-dropdown/EditFileDropdown'
import { FileMother } from '@tests/component/files/domain/models/FileMother'
import { FileMockRepository } from '../../FileMockRepository'

const storyFile = FileMother.createRealistic()

const meta: Meta<typeof EditFileDropdown> = {
  title: 'Sections/File Page/Action Buttons/EditFileDropdown',
  component: EditFileDropdown,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof EditFileDropdown>

export const Default: Story = {
  render: () => (
    <EditFileDropdown
      fileId={storyFile.id}
      fileRepository={new FileMockRepository()}
      datasetInfo={{
        persistentId: storyFile.datasetPersistentId,
        releasedVersionExists: false,
        isDraft: false
      }}
    />
  )
}
