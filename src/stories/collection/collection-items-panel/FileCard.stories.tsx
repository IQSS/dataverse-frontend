import { Meta, StoryObj } from '@storybook/react'
import { FileCard } from '@/sections/collection/collection-items-panel/items-list/file-card/FileCard'
import { WithI18next } from '../../WithI18next'
import { FileItemTypePreviewMother } from '../../../../tests/component/files/domain/models/FileItemTypePreviewMother'
import { FakerHelper } from '../../../../tests/component/shared/FakerHelper'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

const meta: Meta<typeof FileCard> = {
  title: 'Sections/Collection Page/FileCard',
  component: FileCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof FileCard>

export const Default: Story = {
  render: () => (
    <FileCard
      filePreview={FileItemTypePreviewMother.createRealistic({
        thumbnail: FakerHelper.getImageUrl()
      })}
    />
  )
}

export const WithLongDescription: Story = {
  render: () => (
    <FileCard
      filePreview={FileItemTypePreviewMother.createRealistic({
        thumbnail: undefined,
        description:
          'Voluptas amet consectetur dolore doloribus. Cumque et quo eum voluptatem eum dolores dignissimos. Vel inventore quaerat officiis. Nobis debitis quidem hic laudantium blanditiis. Error excepturi dicta aliquam enim ducimus.'
      })}
    />
  )
}

export const WithDraft: Story = {
  render: () => (
    <FileCard
      filePreview={FileItemTypePreviewMother.createRealistic({
        thumbnail: undefined,
        publicationStatuses: [PublicationStatus.Draft]
      })}
    />
  )
}

export const UnpublishedWithDraft: Story = {
  render: () => (
    <FileCard
      filePreview={FileItemTypePreviewMother.createRealistic({
        thumbnail: undefined,
        publicationStatuses: [PublicationStatus.Draft, PublicationStatus.Unpublished]
      })}
    />
  )
}
