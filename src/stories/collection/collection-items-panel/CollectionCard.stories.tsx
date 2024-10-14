import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { CollectionCard } from '@/sections/collection/collection-items-panel/items-list/collection-card/CollectionCard'
import { CollectionItemTypePreviewMother } from '../../../../tests/component/collection/domain/models/CollectionItemTypePreviewMother'
import { FakerHelper } from '../../../../tests/component/shared/FakerHelper'

const meta: Meta<typeof CollectionCard> = {
  title: 'Sections/Collection Page/CollectionCard',
  component: CollectionCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof CollectionCard>

export const Default: Story = {
  render: () => (
    <CollectionCard collectionPreview={CollectionItemTypePreviewMother.createRealistic()} />
  )
}

export const WithLongDescription: Story = {
  render: () => {
    const collectionPreview = CollectionItemTypePreviewMother.create({
      description: FakerHelper.paragraph(20)
    })

    return <CollectionCard collectionPreview={collectionPreview} />
  }
}

export const Unpublished: Story = {
  render: () => (
    <CollectionCard collectionPreview={CollectionItemTypePreviewMother.createUnpublished()} />
  )
}

export const WithThumbnail: Story = {
  render: () => (
    <CollectionCard collectionPreview={CollectionItemTypePreviewMother.createWithThumbnail()} />
  )
}
