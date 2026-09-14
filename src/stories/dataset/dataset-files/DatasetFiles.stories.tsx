import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetFiles } from '../../../sections/dataset/dataset-files/DatasetFiles'
import { FileMockRepository } from '../../file/FileMockRepository'
import { FileMockLoadingRepository } from '../../file/FileMockLoadingRepository'
import { FileMockNoDataRepository } from '../../file/FileMockNoDataRepository'
import { WithSettings } from '../../WithSettings'
import { FileMockNoFiltersRepository } from '../../file/FileMockNoFiltersRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { RepositoriesStoryProvider } from '../../WithRepositories'

const meta: Meta<typeof DatasetFiles> = {
  title: 'Sections/Dataset Page/DatasetFiles',
  component: DatasetFiles,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof DatasetFiles>

const testDataset = DatasetMother.createRealistic()

export const Default: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}>
      <DatasetFiles
        datasetPersistentId={testDataset.persistentId}
        datasetVersion={testDataset.version}
      />
    </RepositoriesStoryProvider>
  )
}

export const Loading: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockLoadingRepository()}>
      <DatasetFiles
        datasetPersistentId={testDataset.persistentId}
        datasetVersion={testDataset.version}
      />
    </RepositoriesStoryProvider>
  )
}

export const NoFiles: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockNoDataRepository()}>
      <DatasetFiles
        datasetPersistentId={testDataset.persistentId}
        datasetVersion={testDataset.version}
      />
    </RepositoriesStoryProvider>
  )
}

export const NoFilters: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockNoFiltersRepository()}>
      <DatasetFiles
        datasetPersistentId={testDataset.persistentId}
        datasetVersion={testDataset.version}
      />
    </RepositoriesStoryProvider>
  )
}
