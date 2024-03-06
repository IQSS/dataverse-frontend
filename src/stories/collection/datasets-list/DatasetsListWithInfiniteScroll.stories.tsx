import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { DatasetsListWithInfiniteScroll } from '../../../sections/collection/datasets-list/DatasetsListWithInfiniteScroll'
import { DatasetLoadingMockRepository } from '../../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../../dataset/NoDatasetsMockRepository'

const meta: Meta<typeof DatasetsListWithInfiniteScroll> = {
  title: 'Sections/Collection/DatasetsListWithInfiniteScroll',
  component: DatasetsListWithInfiniteScroll,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetsListWithInfiniteScroll>

export const Default: Story = {
  render: () => (
    <DatasetsListWithInfiniteScroll
      datasetRepository={new DatasetMockRepository()}
      collectionId="root"
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetsListWithInfiniteScroll
      datasetRepository={new DatasetLoadingMockRepository()}
      collectionId="root"
    />
  )
}

export const NoResults: Story = {
  render: () => (
    <DatasetsListWithInfiniteScroll
      datasetRepository={new NoDatasetsMockRepository()}
      collectionId="root"
    />
  )
}
