import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { FileCard } from '../../../sections/collection/datasets-list/file-card/FileCard'
import { FilePreviewMother } from '../../../../tests/component/files/domain/models/FilePreviewMother'
import {
  FileLabelMother,
  FileMetadataMother
} from '../../../../tests/component/files/domain/models/FileMetadataMother'
import { FakerHelper } from '../../../../tests/component/shared/FakerHelper'
import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'

const meta: Meta<typeof FileCard> = {
  title: 'Sections/Collection Page/FileCard',
  component: FileCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileCard>

export const Default: Story = {
  render: () => <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createDefault()} />
}
export const TabDelimited: Story = {
  render: () => <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createTabular()} />
}
export const WithLongDescription: Story = {
  render: () => {
    const filePreview = FilePreviewMother.createDefault({
      metadata: FileMetadataMother.createDefault({
        description: FakerHelper.paragraph(20)
      })
    })
    return <FileCard persistentId={'testid'} filePreview={filePreview} />
  }
}
export const WithChecksum: Story = {
  render: () => (
    <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createWithChecksum()} />
  )
}
export const WithDraft: Story = {
  render: () => (
    <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createWithDraft()} />
  )
}

export const ReleasedWithDraft: Story = {
  render: () => (
    <FileCard persistentId={'testid'} filePreview={FilePreviewMother.createReleasedWithDraft()} />
  )
}
export const WithAllLabels: Story = {
  render: () => {
    const filePreview = FilePreviewMother.createDefault({
      datasetPublishingStatus: DatasetPublishingStatus.DRAFT,
      someDatasetVersionHasBeenReleased: false,
      metadata: FileMetadataMother.createDefault({
        description: FakerHelper.paragraph(5),
        labels: FileLabelMother.createMany(4)
      })
    })
    return <FileCard persistentId={'testid'} filePreview={filePreview} />
  }
}
