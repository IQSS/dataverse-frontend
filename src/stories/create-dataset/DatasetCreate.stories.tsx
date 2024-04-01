import type { StoryObj, Meta } from '@storybook/react'
import { CreateDatasetForm } from '../../sections/create-dataset/CreateDatasetForm'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { MetadataBlockInfoMockRepository } from './MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from './MetadataBlockInfoMockLoadingRepository'
import { MetadataBlockInfoMockErrorRepository } from './MetadataBlockInfoMockErrorRepository'

const meta: Meta<typeof CreateDatasetForm> = {
  title: 'Pages/Create Dataset',
  component: CreateDatasetForm,
  decorators: [WithI18next, WithLayout]
}
export default meta
type Story = StoryObj<typeof CreateDatasetForm>

export const Default: Story = {
  render: () => (
    <CreateDatasetForm
      repository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const LoadingMetadataBlocksConfiguration: Story = {
  render: () => (
    <CreateDatasetForm
      repository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}

export const ErrorLoadingMetadataBlocksConfiguration: Story = {
  render: () => (
    <CreateDatasetForm
      repository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
    />
  )
}
