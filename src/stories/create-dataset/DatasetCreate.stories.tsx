import type { StoryObj, Meta } from '@storybook/react'
import { CreateDataset } from '../../sections/create-dataset/CreateDataset'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { MetadataBlockInfoMockRepository } from './MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from './MetadataBlockInfoMockLoadingRepository'
import { MetadataBlockInfoMockErrorRepository } from './MetadataBlockInfoMockErrorRepository'
import { NotImplementedModalProvider } from '../../sections/not-implemented/NotImplementedModalProvider'
import { WithLoggedInUser } from '../WithLoggedInUser'

const meta: Meta<typeof CreateDataset> = {
  title: 'Pages/Create Dataset',
  component: CreateDataset,
  decorators: [WithI18next, WithLayout, WithLoggedInUser]
}
export default meta
type Story = StoryObj<typeof CreateDataset>

export const Default: Story = {
  render: () => (
    <NotImplementedModalProvider>
      <CreateDataset
        repository={new DatasetMockRepository()}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      />
    </NotImplementedModalProvider>
  )
}

export const LoadingMetadataBlocksConfiguration: Story = {
  render: () => (
    <CreateDataset
      repository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}

export const ErrorLoadingMetadataBlocksConfiguration: Story = {
  render: () => (
    <CreateDataset
      repository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
    />
  )
}
