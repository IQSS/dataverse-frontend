import type { StoryObj, Meta } from '@storybook/react'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockLoadingRepository'
import { NotImplementedModalProvider } from '../../sections/not-implemented/NotImplementedModalProvider'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { EditDatasetMetadata } from '../../sections/edit-dataset-metadata/EditDatasetMetadata'
import { WithDataset } from '../dataset/WithDataset'

const meta: Meta<typeof EditDatasetMetadata> = {
  title: 'Pages/Edit Dataset Metadata',
  component: EditDatasetMetadata,
  decorators: [WithI18next, WithLayout, WithDataset, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof EditDatasetMetadata>

export const Default: Story = {
  render: () => (
    <NotImplementedModalProvider>
      <EditDatasetMetadata
        datasetRepository={new DatasetMockRepository()}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      />
    </NotImplementedModalProvider>
  )
}

export const Loading: Story = {
  render: () => (
    <EditDatasetMetadata
      datasetRepository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}
