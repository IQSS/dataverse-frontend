import { Meta, StoryObj } from '@storybook/react'
import Homepage from '../../sections/homepage/Homepage'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { DataverseHubMockRepository } from '../dataverse-hub/DataverseHubMockRepository'
import { SearchMockRepository } from '../shared-mock-repositories/search/SearchMockRepository'

const meta: Meta<typeof Homepage> = {
  title: 'Pages/Homepage',
  component: Homepage,
  decorators: [WithI18next, WithLayout],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Homepage>

export const Default: Story = {
  render: () => (
    <Homepage
      collectionRepository={new CollectionMockRepository()}
      dataverseHubRepository={new DataverseHubMockRepository()}
      searchRepository={new SearchMockRepository()}
    />
  )
}

const collectionRepositoryWithFeaturedItems = new CollectionMockRepository()
collectionRepositoryWithFeaturedItems.getFeaturedItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        FeaturedItemMother.createCustomFeaturedItem('css', {
          id: 11,
          displayOrder: 1
        }),
        FeaturedItemMother.createDvObjectCollectionFeaturedItem({
          id: 32,
          displayOrder: 2
        }),
        FeaturedItemMother.createDvObjectDatasetFeaturedItem({
          id: 40,
          displayOrder: 3
        }),
        FeaturedItemMother.createCustomFeaturedItem('books', {
          id: 55,
          displayOrder: 4
        }),
        FeaturedItemMother.createDvObjectFileFeaturedItem({
          id: 45,
          displayOrder: 5
        })
      ])
    }, FakerHelper.loadingTimout())
  })
}

export const WithFeaturedItems: Story = {
  render: () => (
    <Homepage
      collectionRepository={collectionRepositoryWithFeaturedItems}
      dataverseHubRepository={new DataverseHubMockRepository()}
      searchRepository={new SearchMockRepository()}
    />
  )
}
