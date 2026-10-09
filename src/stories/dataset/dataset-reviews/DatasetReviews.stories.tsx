import { Meta, StoryObj } from '@storybook/react'
import { DatasetReviews } from '@/sections/dataset/dataset-reviews/DatasetReviews'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'
import { WithI18next } from '@/stories/WithI18next'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { DatasetWithReviewsMockRepository } from '../DatasetWithReviewsMockRepository'

const meta: Meta<typeof DatasetReviews> = {
  title: 'Sections/Dataset Page/DatasetReviews',
  component: DatasetReviews,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetReviews>

export const WithReviews: Story = {
  render: () => (
    <RepositoriesStoryProvider datasetRepository={new DatasetWithReviewsMockRepository()}>
      <DatasetReviews datasetId="doi:10.5072/FK2/8YOKQI" />
    </RepositoriesStoryProvider>
  )
}

export const WithoutReviews: Story = {
  render: () => (
    <RepositoriesStoryProvider datasetRepository={new DatasetMockRepository()}>
      <DatasetReviews datasetId="doi:10.5072/FK2/8YOKQI" />
    </RepositoriesStoryProvider>
  )
}
