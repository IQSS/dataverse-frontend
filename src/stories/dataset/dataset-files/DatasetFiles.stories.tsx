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
    <DatasetFiles
      filesRepository={new FileMockRepository()}
      datasetRepository={new DatasetMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetFiles
      filesRepository={new FileMockLoadingRepository()}
      datasetRepository={new DatasetMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const NoFiles: Story = {
  render: () => (
    <DatasetFiles
      filesRepository={new FileMockNoDataRepository()}
      datasetRepository={new DatasetMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}

export const NoFilters: Story = {
  render: () => (
    <DatasetFiles
      filesRepository={new FileMockNoFiltersRepository()}
      datasetRepository={new DatasetMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version}
    />
  )
}
