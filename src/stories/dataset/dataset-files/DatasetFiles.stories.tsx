import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../../WithI18next'
import { DatasetFiles } from '../../../sections/dataset/dataset-files/DatasetFiles'
import { DatasetMockData } from '../DatasetMockData'
import { FileMockRepository } from '../../files/FileMockRepository'
import { FileMockLoadingRepository } from '../../files/FileMockLoadingRepository'
import { FileMockNoDataRepository } from '../../files/FileMockNoDataRepository'
import { WithSettings } from '../../WithSettings'

const meta: Meta<typeof DatasetFiles> = {
  title: 'Sections/Dataset Page/DatasetFiles',
  component: DatasetFiles,
  decorators: [WithI18next, WithSettings]
}

export default meta
type Story = StoryObj<typeof DatasetFiles>

const testDataset = DatasetMockData()

export const Default: Story = {
  render: () => (
    <DatasetFiles
      filesRepository={new FileMockRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version.toString()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetFiles
      filesRepository={new FileMockLoadingRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version.toString()}
    />
  )
}

export const NoFiles: Story = {
  render: () => (
    <DatasetFiles
      filesRepository={new FileMockNoDataRepository()}
      datasetPersistentId={testDataset.persistentId}
      datasetVersion={testDataset.version.toString()}
    />
  )
}

// TODO (filesCountInfo) - Implement use case for no filters, pending to be discussed
// export const NoFilters: Story = {
//   render: () => (
//     <DatasetFiles
//       filesRepository={new FileMockNoFiltersRepository()}
//       datasetPersistentId={testDataset.persistentId}
//       datasetVersion={testDataset.version.toString()}
//     />
//   )
// }
