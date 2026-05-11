import { Meta, StoryObj } from '@storybook/react'
import { EditFeaturedItems } from '@/sections/edit-collection-featured-items/EditFeaturedItems'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof EditFeaturedItems> = {
  title: 'Pages/Edit Featured Items',
  component: EditFeaturedItems,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof EditFeaturedItems>

export const Default: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <EditFeaturedItems collectionIdFromParams="root" />
    </RepositoriesStoryProvider>
  )
}

const collectionRepositoryWithFeaturedItems = new CollectionMockRepository()
collectionRepositoryWithFeaturedItems.getFeaturedItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(FeaturedItemMother.createFeaturedItems())
    }, FakerHelper.loadingTimout())
  })
}

export const WithInitialFeaturedItems: Story = {
  render: () => (
    <RepositoriesStoryProvider collectionRepository={collectionRepositoryWithFeaturedItems}>
      <EditFeaturedItems collectionIdFromParams="root" />
    </RepositoriesStoryProvider>
  )
}
