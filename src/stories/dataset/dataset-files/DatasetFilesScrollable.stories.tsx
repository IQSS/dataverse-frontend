import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetFilesScrollable } from '../../../sections/dataset/dataset-files/DatasetFilesScrollable'
import { FileMockRepository } from '../../file/FileMockRepository'
import { FileMockLoadingRepository } from '../../file/FileMockLoadingRepository'
import { FileMockNoDataRepository } from '../../file/FileMockNoDataRepository'
import { WithSettings } from '../../WithSettings'
import { FileMockNoFiltersRepository } from '../../file/FileMockNoFiltersRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetMockRepository } from '../DatasetMockRepository'

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
    <DatasetFilesScrollable
      filesRepository={new FileMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetFilesScrollable
      filesRepository={new FileMockLoadingRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const NoFiles: Story = {
  render: () => (
    <DatasetFilesScrollable
      filesRepository={new FileMockNoDataRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}

export const NoFilters: Story = {
  render: () => (
    <DatasetFilesScrollable
      filesRepository={new FileMockNoFiltersRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
      datasetRepository={new DatasetMockRepository()}
    />
  )
}
