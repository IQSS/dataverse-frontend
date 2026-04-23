import { DatasetMetrics } from '@/sections/dataset/dataset-metrics/DatasetMetrics'
import { WithI18next } from '@/stories/WithI18next'
import { Meta, StoryObj } from '@storybook/react'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { DatasetDownloadCountMother } from '@tests/component/dataset/domain/models/DatasetDownloadCountMother'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

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
    <RepositoriesStoryProvider datasetRepository={datasetMockRepoWithoutMakeDataCount}>
      <DatasetMetrics datasetId={1} />
    </RepositoriesStoryProvider>
  )
}

export const WithMakeDataCountEnabled: Story = {
  render: () => (
    <RepositoriesStoryProvider datasetRepository={new DatasetMockRepository()}>
      <DatasetMetrics datasetId={1} />
    </RepositoriesStoryProvider>
  )
}

export const WithBigNumbersMDCEnabled: Story = {
  render: () => {
    const datasetMockRepoWithBigNumbers = new DatasetMockRepository()

    datasetMockRepoWithBigNumbers.getDownloadCount = (
      _datasetId: number | string,
      includeMDC: boolean
    ) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          if (includeMDC) {
            resolve(
              DatasetDownloadCountMother.createWithMDCStartDate({
                downloadCount: 1495020
              })
            )
          } else {
            resolve(
              DatasetDownloadCountMother.createWithoutMDCStartDate({
                downloadCount: 365900
              })
            )
          }
        }, FakerHelper.loadingTimout())
      })
    }

    return (
      <RepositoriesStoryProvider datasetRepository={datasetMockRepoWithBigNumbers}>
        <DatasetMetrics datasetId={1} />
      </RepositoriesStoryProvider>
    )
  }
}
