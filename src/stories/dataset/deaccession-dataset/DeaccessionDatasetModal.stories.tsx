import { Meta, StoryObj } from '@storybook/react'
import { DeaccessionDatasetModal } from '../../../sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { DatasetVersionSummaryStringValues } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetLoadingMockRepository } from '../DatasetLoadingMockRepository'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof DeaccessionDatasetModal> = {
  title: 'Sections/Dataset Page/Deaccession Dataset/DeaccessionDatasetModal',
  component: DeaccessionDatasetModal,
  decorators: [WithI18next]
}

export default meta

type Story = StoryObj<typeof DeaccessionDatasetModal>

export const Default: Story = {
  decorators: [WithLoggedInUser],
  render: () => {
    return (
      <RepositoriesStoryProvider datasetRepository={new DatasetMockRepository()}>
        <DeaccessionDatasetModal
          show={true}
          datasetPersistentId="test-dataset-id"
          handleCloseDeaccessionModal={() => {}}
        />
      </RepositoriesStoryProvider>
    )
  }
}

export const WithOneVersion: Story = {
  decorators: [WithLoggedInUser],
  render: () => {
    const datasetMockRepository = new DatasetMockRepository()
    datasetMockRepository.getDatasetVersionsSummaries = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            summaries: [
              {
                id: 1,
                contributors: 'contributors',
                versionNumber: '1.0',
                publishedOn: '2023-01-01',
                summary: DatasetVersionSummaryStringValues.firstPublished
              }
            ],
            totalCount: 1
          })
        }, 1_000)
      })
    }

    return (
      <RepositoriesStoryProvider datasetRepository={datasetMockRepository}>
        <DeaccessionDatasetModal
          show={true}
          datasetPersistentId="test-dataset-id"
          handleCloseDeaccessionModal={() => {}}
        />
      </RepositoriesStoryProvider>
    )
  }
}

export const LoadingDatasetVersionSummaries: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <RepositoriesStoryProvider datasetRepository={new DatasetLoadingMockRepository()}>
      <DeaccessionDatasetModal
        show={true}
        datasetPersistentId="test-dataset-id"
        handleCloseDeaccessionModal={() => {}}
      />
    </RepositoriesStoryProvider>
  )
}
