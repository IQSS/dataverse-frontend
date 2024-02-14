import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileMetadata } from '../../../sections/file/file-metadata/FileMetadata'
import { FileMetadataMother } from '../../../../tests/component/files/domain/models/FileMetadataMother'
import { FilePublishingStatus } from '../../../files/domain/models/FileVersion'
import { FilePermissionsMother } from '../../../../tests/component/files/domain/models/FilePermissionsMother'

const meta: Meta<typeof FileMetadata> = {
  title: 'Sections/File Page/FileMetadata',
  component: FileMetadata,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileMetadata>

export const Default: Story = {
  render: () => (
    <FileMetadata
      name="File Title"
      metadata={FileMetadataMother.createDefault()}
      permissions={FilePermissionsMother.create()}
      publishingStatus={FilePublishingStatus.RELEASED}
    />
  )
}
