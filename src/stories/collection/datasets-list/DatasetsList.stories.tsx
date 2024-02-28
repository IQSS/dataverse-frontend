import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { DatasetsList } from '../../../sections/collection/datasets-list/DatasetsList'
import { DatasetLoadingMockRepository } from '../../dataset/DatasetLoadingMockRepository'
import { NoDatasetsMockRepository } from '../../dataset/NoDatasetsMockRepository'

const meta: Meta<typeof DatasetsList> = {
  title: 'Sections/Collection/DatasetsList',
  component: DatasetsList,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetsList>

export const Default: Story = {
  render: () => <DatasetsList datasetRepository={new DatasetMockRepository()} collectionId="root" />
}

export const Loading: Story = {
  render: () => (
    <DatasetsList datasetRepository={new DatasetLoadingMockRepository()} collectionId="root" />
  )
}

export const NoResults: Story = {
  render: () => (
    <DatasetsList datasetRepository={new NoDatasetsMockRepository()} collectionId="root" />
  )
}
