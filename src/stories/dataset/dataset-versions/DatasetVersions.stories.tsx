import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import {
  DatasetVersions,
  DatasetVersionsLoadingSkeleton
} from '../../../sections/dataset/dataset-versions/DatasetVersions'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'

const meta: Meta<typeof DatasetVersions> = {
  title: 'Sections/Dataset Page/DatasetVersions',
  component: DatasetVersions,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetVersions>

export const Default: Story = {
  render: () => (
    <DatasetVersions
      datasetRepository={new DatasetMockRepository()}
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
