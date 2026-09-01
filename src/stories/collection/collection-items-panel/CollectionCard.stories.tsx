import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { CollectionCard } from '@/sections/collection/collection-items-panel/items-list/collection-card/CollectionCard'
import { CollectionItemTypePreviewMother } from '../../../../tests/component/collection/domain/models/CollectionItemTypePreviewMother'

const collectionPreview = CollectionItemTypePreviewMother.createRealistic()
const longDescriptionCollectionPreview = CollectionItemTypePreviewMother.create({
  ...collectionPreview,
  description: 'Scientific research collection with a detailed public description. '
    .repeat(20)
    .trim()
})
const unpublishedCollectionPreview = CollectionItemTypePreviewMother.create({
  ...collectionPreview,
  isReleased: false
})
const thumbnailCollectionPreview = CollectionItemTypePreviewMother.create({
  ...collectionPreview,
  thumbnail:
    'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2248%22 viewBox=%220 0 64 48%22%3E%3Crect width=%2264%22 height=%2248%22 fill=%22%23f1f5f9%22/%3E%3Cpath d=%22M10 34l12-12 9 9 8-8 15 15H10z%22 fill=%22%235b728a%22/%3E%3Ccircle cx=%2246%22 cy=%2214%22 r=%226%22 fill=%22%23f9c74f%22/%3E%3C/svg%3E'
})
const linkedCollectionPreview = CollectionItemTypePreviewMother.create({
  ...collectionPreview,
  isLinked: true
})

const meta: Meta<typeof CollectionCard> = {
  title: 'Sections/Collection Page/CollectionCard',
  component: CollectionCard,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof CollectionCard>

export const Default: Story = {
  render: () => (
    <CollectionCard parentCollectionAlias="parentAlias" collectionPreview={collectionPreview} />
  )
}

export const WithLongDescription: Story = {
  render: () => (
    <CollectionCard
      parentCollectionAlias="parentAlias"
      collectionPreview={longDescriptionCollectionPreview}
    />
  )
}

export const Unpublished: Story = {
  render: () => (
    <CollectionCard
      parentCollectionAlias="parentAlias"
      collectionPreview={unpublishedCollectionPreview}
    />
  )
}

export const WithThumbnail: Story = {
  render: () => (
    <CollectionCard
      parentCollectionAlias="parentAlias"
      collectionPreview={thumbnailCollectionPreview}
    />
  )
}

export const Linked: Story = {
  render: () => (
    <CollectionCard
      parentCollectionAlias="parentAlias"
      collectionPreview={linkedCollectionPreview}
    />
  )
}
