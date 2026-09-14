import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import {
  DatasetVersions,
  DatasetVersionsLoadingSkeleton
} from '../../../sections/dataset/dataset-versions/DatasetVersions'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { WithRepositories } from '../../WithRepositories'

const meta: Meta<typeof DatasetVersions> = {
  title: 'Sections/Dataset Page/DatasetVersions',
  component: DatasetVersions,
  decorators: [WithI18next, WithRepositories({ datasetRepository: new DatasetMockRepository() })]
}

export default meta
type Story = StoryObj<typeof DatasetVersions>

export const Default: Story = {
  render: () => (
    <DatasetVersions
      currentVersionNumber={'1.0'}
      canUpdateDataset={true}
      datasetId="test-dataset-id"
      isInView
    />
  )
}

export const Loading: Story = {
  render: () => <DatasetVersionsLoadingSkeleton />
}
