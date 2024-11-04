import type { StoryObj, Meta } from '@storybook/react'
import { CreateDataset } from '../../sections/create-dataset/CreateDataset'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { DatasetMockRepository } from '../dataset/DatasetMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockLoadingRepository'
import { NotImplementedModalProvider } from '../../sections/not-implemented/NotImplementedModalProvider'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { CollectionMother } from '../../../tests/component/collection/domain/models/CollectionMother'

const meta: Meta<typeof CreateDataset> = {
  title: 'Pages/Create Dataset',
  component: CreateDataset,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof CreateDataset>

export const Default: Story = {
  render: () => (
    <NotImplementedModalProvider>
      <CreateDataset
        datasetRepository={new DatasetMockRepository()}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
        collectionRepository={new CollectionMockRepository()}
        collectionId={'collectionId'}
      />
    </NotImplementedModalProvider>
  )
}

export const Loading: Story = {
  render: () => (
    <CreateDataset
      datasetRepository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
      collectionRepository={new CollectionMockRepository()}
      collectionId={'collectionId'}
    />
  )
}

const collectionRepositoryWithoutPermissionsToCreateDataset = new CollectionMockRepository()
collectionRepositoryWithoutPermissionsToCreateDataset.getUserPermissions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        CollectionMother.createUserPermissions({
          canAddDataset: false
        })
      )
    }, FakerHelper.loadingTimout())
  })
}

export const NotAllowedToAddDataset: Story = {
  render: () => (
    <CreateDataset
      datasetRepository={new DatasetMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionRepository={collectionRepositoryWithoutPermissionsToCreateDataset}
      collectionId={'collectionId'}
    />
  )
}
