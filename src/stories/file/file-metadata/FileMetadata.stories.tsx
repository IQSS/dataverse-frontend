import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileMetadata } from '../../../sections/file/file-metadata/FileMetadata'
import { FileMetadataMother } from '../../../../tests/component/files/domain/models/FileMetadataMother'
import { FilePermissionsMother } from '../../../../tests/component/files/domain/models/FilePermissionsMother'
import { DatasetVersionMother } from '@tests/component/dataset/domain/models/DatasetMother'
import { DataverseInfoMockRepository } from '@/stories/shared-mock-repositories/info/DataverseInfoMockRepository'

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
      datasetPersistentId="doi:10.5072/FK2/12345"
      datasetVersion={DatasetVersionMother.create()}
      dataverseInfoRepository={new DataverseInfoMockRepository()}
    />
  )
}
