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
import { ContactMockRepository } from '../shared/contact/ContactMockRepository'

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
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={false}
      accountCreated={false}
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
      contactRepository={new ContactMockRepository()}
      created={false}
      published={false}
      accountCreated={false}
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
      contactRepository={new ContactMockRepository()}
      created={false}
      published={false}
      accountCreated={false}
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
      contactRepository={new ContactMockRepository()}
      created={false}
      published={false}
      accountCreated={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const Created: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={true}
      published={false}
      accountCreated={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}
export const Published: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={true}
      accountCreated={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const AccountCreated: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={false}
      accountCreated={true}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const Edited: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={false}
      edited={true}
      accountCreated={false}
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
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      published={false}
      accountCreated={false}
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: undefined
      }}
    />
  )
}
