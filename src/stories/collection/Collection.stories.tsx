import type { Meta, StoryObj } from '@storybook/react'
import { Collection } from '../../sections/collection/Collection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionLoadingMockRepository } from './CollectionLoadingMockRepository'

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
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
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
