import type { Meta, StoryObj } from '@storybook/react'
import { Collection } from '../../sections/collection/Collection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionLoadingMockRepository } from './CollectionLoadingMockRepository'
import { UnpublishedCollectionMockRepository } from '@/stories/collection/UnpublishedCollectionMockRepository'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

const meta: Meta<typeof Collection> = {
  title: 'Pages/Collection',
  component: Collection,
  decorators: [WithI18next, WithLayout],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof Collection>

export const Default: Story = {
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={false}
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: undefined
      }}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <Collection
      collectionIdFromParams="collection"
      collectionRepository={new CollectionLoadingMockRepository()}
      created={false}
      published={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionIdFromParams="collection"
      collectionRepository={new CollectionMockRepository()}
      created={false}
      published={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}
export const Unpublished: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionIdFromParams="collection"
      collectionRepository={new UnpublishedCollectionMockRepository()}
      created={false}
      published={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const Created: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      collectionIdFromParams="collection"
      created={true}
      published={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}
export const Published: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={true}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const Edited: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={false}
      edited={true}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
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

export const WithFeaturedItems: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={collectionRepositoryWithFeaturedItems}
      collectionIdFromParams="collection"
      created={false}
      published={false}
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: undefined
      }}
    />
  )
}
