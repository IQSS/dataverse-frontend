import { Meta, StoryObj } from '@storybook/react'
import { CollectionFeaturedItems } from '@/sections/collection-featured-items/CollectionFeaturedItems'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

const meta: Meta<typeof CollectionFeaturedItems> = {
  title: 'Pages/Collection Featured Items',
  component: CollectionFeaturedItems,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof CollectionFeaturedItems>

export const Default: Story = {
  render: () => (
    <CollectionFeaturedItems
      collectionRepository={new CollectionMockRepository()}
      collectionIdFromParams="root"
    />
  )
}

const collectionRepositoryWithFeaturedItems = new CollectionMockRepository()
collectionRepositoryWithFeaturedItems.getFeaturedItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(CollectionFeaturedItemMother.createFeaturedItems())
    }, FakerHelper.loadingTimout())
  })
}

export const WithInitialFeaturedItems: Story = {
  render: () => (
    <CollectionFeaturedItems
      collectionRepository={collectionRepositoryWithFeaturedItems}
      collectionIdFromParams="root"
    />
  )
}
