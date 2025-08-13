import type { StoryObj, Meta } from '@storybook/react'
import { DatasetMetadataForm } from '../../../sections/shared/form/DatasetMetadataForm'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { DatasetMockRepository } from '../../dataset/DatasetMockRepository'
import { MetadataBlockInfoMockRepository } from '../../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { DatasetMother } from '../../../../tests/component/dataset/domain/models/DatasetMother'

const meta: Meta<typeof DatasetMetadataForm> = {
  title: 'Sections/Shared/Dataset Metadata Form',
  component: DatasetMetadataForm,
  decorators: [WithI18next, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof DatasetMetadataForm>

export const CreateMode: Story = {
  render: () => (
    <DatasetMetadataForm
      mode="create"
      collectionId="root"
      datasetRepository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

const datasetToEditMock = DatasetMother.createRealistic()

export const EditMode: Story = {
  render: () => (
    <DatasetMetadataForm
      mode="edit"
      collectionId="root"
      datasetRepository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      datasetPersistentID={datasetToEditMock.persistentId}
      datasetMetadaBlocksCurrentValues={datasetToEditMock.metadataBlocks}
      datasetInternalVersionNumber={1}
    />
  )
}
