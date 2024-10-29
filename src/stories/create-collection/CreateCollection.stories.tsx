import { Meta, StoryObj } from '@storybook/react'
import { CreateCollection } from '../../sections/create-collection/CreateCollection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../collection/CollectionLoadingMockRepository'
import { NoCollectionMockRepository } from '../collection/NoCollectionMockRepository'
import { CollectionMother } from '../../../tests/component/collection/domain/models/CollectionMother'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockLoadingRepository'
import { MetadataBlockInfoMockErrorRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockErrorRepository'

import { ROOT_COLLECTION_ALIAS } from '@tests/e2e-integration/shared/collection/CollectionHelper'

const meta: Meta<typeof CreateCollection> = {
  title: 'Pages/Create Collection',
  component: CreateCollection,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof CreateCollection>

export const Default: Story = {
  render: () => (
    <CreateCollection
      collectionRepository={new CollectionMockRepository()}
      ownerCollectionId={ROOT_COLLECTION_ALIAS}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}
export const Loading: Story = {
  render: () => (
    <CreateCollection
      collectionRepository={new CollectionLoadingMockRepository()}
      ownerCollectionId={ROOT_COLLECTION_ALIAS}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}

export const OwnerCollectionNotFound: Story = {
  render: () => (
    <CreateCollection
      collectionRepository={new NoCollectionMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
      ownerCollectionId={ROOT_COLLECTION_ALIAS}
    />
  )
}

const collectionRepositoryWithoutPermissionsToCreateCollection = new CollectionMockRepository()
collectionRepositoryWithoutPermissionsToCreateCollection.getUserPermissions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        CollectionMother.createUserPermissions({
          canAddCollection: false
        })
      )
    }, FakerHelper.loadingTimout())
  })
}

export const NotAllowedToAddCollection: Story = {
  render: () => (
    <CreateCollection
      collectionRepository={collectionRepositoryWithoutPermissionsToCreateCollection}
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
      ownerCollectionId={ROOT_COLLECTION_ALIAS}
    />
  )
}
