import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '@/stories/WithI18next'
import { FeaturedItems } from '@/sections/collection/featured-items/FeaturedItems'
import { CollectionMockRepository } from '../CollectionMockRepository'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

const collectionRepositoryWithFeaturedItems = new CollectionMockRepository()
const customFeaturedItemOne = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
  id: 1,
  displayOrder: 1
})
const customFeaturedItemTwo = CollectionFeaturedItemMother.createCustomFeaturedItem('books', {
  id: 2,
  displayOrder: 4
})

const dvObjectCollectionFeaturedItem =
  CollectionFeaturedItemMother.createDvObjectCollectionFeaturedItem({
    id: 3,
    displayOrder: 2
  })

const dvObjectDatasetFeaturedItem = CollectionFeaturedItemMother.createDvObjectDatasetFeaturedItem({
  id: 4,
  displayOrder: 3
})

const dvObjectFileFeaturedItem = CollectionFeaturedItemMother.createDvObjectFileFeaturedItem({
  id: 5,
  displayOrder: 5
})

collectionRepositoryWithFeaturedItems.getFeaturedItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        customFeaturedItemOne,
        dvObjectCollectionFeaturedItem,
        dvObjectDatasetFeaturedItem,
        customFeaturedItemTwo,
        dvObjectFileFeaturedItem
      ])
    }, FakerHelper.loadingTimout())
  })
}

const meta: Meta<typeof FeaturedItems> = {
  title: 'Sections/Collection Page/Featured Items',
  component: FeaturedItems,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof FeaturedItems>

export const Default: Story = {
  render: () => (
    <FeaturedItems
      collectionRepository={collectionRepositoryWithFeaturedItems}
      collectionId="testAlias"
    />
  )
}
