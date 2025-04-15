import { Meta, StoryObj } from '@storybook/react'
import { EditCollectionFeaturedItems } from '@/sections/edit-collection-featured-items/EditCollectionFeaturedItems'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

const meta: Meta<typeof EditCollectionFeaturedItems> = {
  title: 'Pages/Edit Collection Featured Items',
  component: EditCollectionFeaturedItems,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof EditCollectionFeaturedItems>

export const Default: Story = {
  render: () => (
    <EditCollectionFeaturedItems
      collectionRepository={new CollectionMockRepository()}
      collectionIdFromParams="root"
    />
  )
}

const collectionRepositoryWithFeaturedItems = new CollectionMockRepository()
collectionRepositoryWithFeaturedItems.getFeaturedItems = () => {
  const customFeaturedItem = CollectionFeaturedItemMother.createCustomFeaturedItem('css')
  const dvObjectCollectionFeaturedItem =
    CollectionFeaturedItemMother.createDvObjectCollectionFeaturedItem()
  const dvObjectDatasetFeaturedItem =
    CollectionFeaturedItemMother.createDvObjectDatasetFeaturedItem()
  const dvObjectFileFeaturedItem = CollectionFeaturedItemMother.createDvObjectFileFeaturedItem()

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        customFeaturedItem,
        dvObjectCollectionFeaturedItem,
        dvObjectDatasetFeaturedItem,
        dvObjectFileFeaturedItem
      ])
    }, FakerHelper.loadingTimout())
  })
}

export const WithInitialFeaturedItems: Story = {
  render: () => (
    <EditCollectionFeaturedItems
      collectionRepository={collectionRepositoryWithFeaturedItems}
      collectionIdFromParams="root"
    />
  )
}
