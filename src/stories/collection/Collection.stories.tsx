import type { Meta, StoryObj } from '@storybook/react'
import { Collection } from '../../sections/collection/Collection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { DatasetLoadingMockRepository } from '../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../dataset/NoDatasetsMockRepository'
import { WithLoggedInUser } from '../WithLoggedInUser'

const meta: Meta<typeof Collection> = {
  title: 'Pages/Collection',
  component: Collection,
  decorators: [WithI18next, WithLayout]
}

export default meta
type Story = StoryObj<typeof Collection>

export const Default: Story = {
  render: () => <Collection datasetRepository={new DatasetMockRepository()} id="collection" />
}

export const InfiniteScrollingEnabled: Story = {
  render: () => (
    <Collection
      datasetRepository={new DatasetMockRepository()}
      id="collection"
      infiniteScrollEnabled={true}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <Collection datasetRepository={new DatasetLoadingMockRepository()} id="collection" />
  )
}

export const NoResults: Story = {
  render: () => <Collection datasetRepository={new NoDatasetsMockRepository()} id="collection" />
}

export const LoggedIn: Story = {
  decorators: [WithLoggedInUser],
  render: () => <Collection datasetRepository={new DatasetMockRepository()} id="collection" />
}
