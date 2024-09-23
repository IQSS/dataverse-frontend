import type { Meta, StoryObj } from '@storybook/react'
import { Collection } from '../../sections/collection/Collection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { DatasetLoadingMockRepository } from '../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../dataset/NoDatasetsMockRepository'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from './CollectionMockRepository'
import { CollectionLoadingMockRepository } from './CollectionLoadingMockRepository'
import { NoCollectionMockRepository } from './NoCollectionMockRepository'

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
      repository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      id="collection"
      created={false}
      published={false}
    />
  )
}

export const InfiniteScrollingEnabled: Story = {
  render: () => (
    <Collection
      repository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      id="collection"
      infiniteScrollEnabled={true}
      created={false}
      published={false}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <Collection
      repository={new CollectionLoadingMockRepository()}
      datasetRepository={new DatasetLoadingMockRepository()}
      id="collection"
      created={false}
      published={false}
    />
  )
}

export const NoResults: Story = {
  render: () => (
    <Collection
      repository={new NoCollectionMockRepository()}
      datasetRepository={new NoDatasetsMockRepository()}
      id="collection"
      created={false}
      published={false}
    />
  )
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      repository={new CollectionMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      id="collection"
      created={false}
      published={false}
    />
  )
}

export const Created: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      repository={new CollectionMockRepository()}
      datasetRepository={new NoDatasetsMockRepository()}
      id="collection"
      created={true}
      published={false}
    />
  )
}
export const Published: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <Collection
      repository={new CollectionMockRepository()}
      datasetRepository={new NoDatasetsMockRepository()}
      id="collection"
      created={false}
      published={true}
    />
  )
}
