import { Meta, StoryObj } from '@storybook/react'
import { NewCollection } from '../../sections/new-collection/NewCollection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../collection/CollectionLoadingMockRepository'
import { NoCollectionMockRepository } from '../collection/NoCollectionMockRepository'

const meta: Meta<typeof NewCollection> = {
  title: 'Pages/New Collection',
  component: NewCollection,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof NewCollection>

export const Default: Story = {
  render: () => (
    <NewCollection collectionRepository={new CollectionMockRepository()} ownerCollectionId="root" />
  )
}
export const Loading: Story = {
  render: () => (
    <NewCollection
      collectionRepository={new CollectionLoadingMockRepository()}
      ownerCollectionId="root"
    />
  )
}

export const OwnerCollectionNotFound: Story = {
  render: () => (
    <NewCollection
      collectionRepository={new NoCollectionMockRepository()}
      ownerCollectionId="root"
    />
  )
}
