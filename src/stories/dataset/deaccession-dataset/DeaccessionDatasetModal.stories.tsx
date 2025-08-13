import { Meta, StoryObj } from '@storybook/react'
import { DeaccessionDatasetModal } from '../../../sections/dataset/deaccession-dataset/DeaccessionDatasetModal'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { DatasetVersionSummaryStringValues } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetLoadingMockRepository } from '../DatasetLoadingMockRepository'

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
      <DeaccessionDatasetModal
        show={true}
        datasetRepository={new DatasetMockRepository()}
        datasetPersistentId="test-dataset-id"
        handleCloseDeaccessionModal={() => {}}
      />
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
          resolve([
            {
              id: 1,
              contributors: 'contributors',
              versionNumber: '1.0',
              publishedOn: '2023-01-01',
              summary: DatasetVersionSummaryStringValues.firstPublished
            }
          ])
        }, 1_000)
      })
    }

    return (
      <DeaccessionDatasetModal
        show={true}
        datasetRepository={datasetMockRepository}
        datasetPersistentId="test-dataset-id"
        handleCloseDeaccessionModal={() => {}}
      />
    )
  }
}

export const LoadingDatasetVersionSummaries: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <DeaccessionDatasetModal
      show={true}
      datasetRepository={new DatasetLoadingMockRepository()}
      datasetPersistentId="test-dataset-id"
      handleCloseDeaccessionModal={() => {}}
    />
  )
}
