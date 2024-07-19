import { Meta, StoryObj } from '@storybook/react'
import { CreateCollection } from '../../sections/create-collection/CreateCollection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../collection/CollectionLoadingMockRepository'
import { NoCollectionMockRepository } from '../collection/NoCollectionMockRepository'

const meta: Meta<typeof CreateCollection> = {
  title: 'Pages/Create Collection',
  component: CreateCollection,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof CreateCollection>

export const Default: Story = {
  render: () => (
    <CreateCollection
      collectionRepository={new CollectionMockRepository()}
      ownerCollectionId="root"
    />
  )
}
export const Loading: Story = {
  render: () => (
    <CreateCollection
      collectionRepository={new CollectionLoadingMockRepository()}
      ownerCollectionId="root"
    />
  )
}

export const OwnerCollectionNotFound: Story = {
  render: () => (
    <CreateCollection
      collectionRepository={new NoCollectionMockRepository()}
      ownerCollectionId="root"
    />
  )
}
