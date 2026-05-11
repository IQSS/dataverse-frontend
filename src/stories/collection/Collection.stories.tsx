import type { Meta, StoryObj } from '@storybook/react'
import { Collection } from '../../sections/collection/Collection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionLoadingMockRepository } from './CollectionLoadingMockRepository'
import { UnpublishedCollectionMockRepository } from '@/stories/collection/UnpublishedCollectionMockRepository'
import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { ContactMockRepository } from '../shared-mock-repositories/contact/ContactMockRepository'
import { WithRepositories } from '../WithRepositories'

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
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => (
    <Collection
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
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
  decorators: [WithRepositories({ collectionRepository: new CollectionLoadingMockRepository() })],
  render: () => (
    <Collection
      collectionIdFromParams="collection"
      contactRepository={new ContactMockRepository()}
      created={false}
      accountCreated={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const LoggedIn: Story = {
  decorators: [
    WithLoggedInUser,
    WithRepositories({ collectionRepository: new CollectionMockRepository() })
  ],
  render: () => (
    <Collection
      collectionIdFromParams="collection"
      contactRepository={new ContactMockRepository()}
      created={false}
      accountCreated={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}
export const Unpublished: Story = {
  decorators: [
    WithLoggedInUser,
    WithRepositories({ collectionRepository: new UnpublishedCollectionMockRepository() })
  ],
  render: () => (
    <Collection
      collectionIdFromParams="collection"
      contactRepository={new ContactMockRepository()}
      created={false}
      accountCreated={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const Created: Story = {
  decorators: [
    WithLoggedInUser,
    WithRepositories({ collectionRepository: new CollectionMockRepository() })
  ],
  render: () => (
    <Collection
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={true}
      accountCreated={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const AccountCreated: Story = {
  decorators: [
    WithLoggedInUser,
    WithRepositories({ collectionRepository: new CollectionMockRepository() })
  ],
  render: () => (
    <Collection
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      accountCreated={true}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
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

export const WithFeaturedItems: Story = {
  decorators: [
    WithLoggedInUser,
    WithRepositories({ collectionRepository: collectionRepositoryWithFeaturedItems })
  ],
  render: () => (
    <Collection
      contactRepository={new ContactMockRepository()}
      collectionIdFromParams="collection"
      created={false}
      accountCreated={false}
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: undefined
      }}
    />
  )
}
