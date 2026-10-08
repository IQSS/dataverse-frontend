import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetFilesScrollable } from '../../../sections/dataset/dataset-files/DatasetFilesScrollable'
import { FileMockRepository } from '../../file/FileMockRepository'
import { FileMockLoadingRepository } from '../../file/FileMockLoadingRepository'
import { FileMockNoDataRepository } from '../../file/FileMockNoDataRepository'
import { WithSettings } from '../../WithSettings'
import { FileMockNoFiltersRepository } from '../../file/FileMockNoFiltersRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { RepositoriesStoryProvider } from '../../WithRepositories'

const meta: Meta<typeof DatasetFilesScrollable> = {
  title: 'Sections/Dataset Page/DatasetFilesScrollable',
  component: DatasetFilesScrollable,
  decorators: [WithI18next, WithSettings],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof DatasetFilesScrollable>

const testDataset = DatasetMother.createRealistic()

export const Default: Story = {
  render: () => (
    <RepositoriesStoryProvider
      datasetRepository={new DatasetMockRepository()}
      fileRepository={new FileMockRepository()}>
      <DatasetFilesScrollable
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
      <DatasetFilesScrollable
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
      <DatasetFilesScrollable
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
      <DatasetFilesScrollable
        datasetPersistentId={testDataset.persistentId}
        datasetVersion={testDataset.version}
      />
    </RepositoriesStoryProvider>
  )
}
