import { DatasetMetrics } from '@/sections/dataset/dataset-metrics/DatasetMetrics'
import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { DatasetDownloadCountMother } from '@tests/component/dataset/domain/models/DatasetDownloadCountMother'

const meta: Meta<typeof DatasetMetrics> = {
  title: 'Sections/Dataset Page/DatasetMetrics',
  component: DatasetMetrics,
  decorators: [WithI18next]
}

export default meta
type Story = StoryObj<typeof DatasetMetrics>

const datasetMockRepoWithoutMakeDataCount = new DatasetMockRepository()
datasetMockRepoWithoutMakeDataCount.getDownloadCount = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DatasetDownloadCountMother.createWithoutMDCStartDate())
    }, FakerHelper.loadingTimout())
  })
}

export const WithoutMakeDataCountEnabled: Story = {
  render: () => (
    <DatasetMetrics datasetRepository={datasetMockRepoWithoutMakeDataCount} datasetId={1} />
  )
}

export const WithMakeDataCountEnabled: Story = {
  render: () => <DatasetMetrics datasetRepository={new DatasetMockRepository()} datasetId={1} />
}
