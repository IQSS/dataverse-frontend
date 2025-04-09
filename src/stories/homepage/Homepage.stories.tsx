import { Meta, StoryObj } from '@storybook/react'
import Homepage from '../../sections/homepage/Homepage'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { DataverseHubMockRepository } from '../dataverse-hub/DataverseHubMockRepository'

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
    />
  )
}

const collectionRepositoryWithFeaturedItems = new CollectionMockRepository()
collectionRepositoryWithFeaturedItems.getFeaturedItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
          id: 11,
          displayOrder: 1
        }),
        CollectionFeaturedItemMother.createDvObjectCollectionFeaturedItem({
          id: 32,
          displayOrder: 2
        }),
        CollectionFeaturedItemMother.createDvObjectDatasetFeaturedItem({
          id: 40,
          displayOrder: 3
        }),
        CollectionFeaturedItemMother.createCustomFeaturedItem('books', {
          id: 55,
          displayOrder: 4
        }),
        CollectionFeaturedItemMother.createDvObjectFileFeaturedItem({
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
    />
  )
}
