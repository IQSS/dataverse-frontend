import type { Meta, StoryObj } from '@storybook/react'
import { Collection } from '../../sections/collection/Collection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionLoadingMockRepository } from './CollectionLoadingMockRepository'
import { CollectionFeaturedItemsMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemsMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { faker } from '@faker-js/faker'

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
      collectionId="collection"
      created={false}
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
      collectionRepository={new CollectionLoadingMockRepository()}
      collectionId="collection"
      created={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      collectionId="collection"
      created={false}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const Created: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      collectionRepository={new CollectionMockRepository()}
      collectionId="collection"
      created={true}
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
    />
  )
}

export const WithFeaturedItems: Story = {
  render: () => {
    const collectionRepositoryWitFeaturedItems = new CollectionMockRepository()

    collectionRepositoryWitFeaturedItems.getById = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            CollectionMother.createRealistic({
              description:
                'This is the description of the collection. When the user configures any featured item for the collection and the collection already has a description, it will be displayed here in the featured item entitled About.'
            })
          )
        }, 1_000)
      })
    }

    collectionRepositoryWitFeaturedItems.getFeaturedItems = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve([
            CollectionFeaturedItemsMother.createWithImage(undefined, 'city'),
            CollectionFeaturedItemsMother.create(),
            CollectionFeaturedItemsMother.createWithImage(undefined, 'dog'),
            CollectionFeaturedItemsMother.create({
              content: faker.lorem.paragraphs(100)
            })
          ])
        }, 1_000)
      })
    }
    return (
      <Collection
        collectionRepository={collectionRepositoryWitFeaturedItems}
        collectionId="collection"
        created={false}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
      />
    )
  }
}
