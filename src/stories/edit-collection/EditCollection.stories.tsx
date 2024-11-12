import { Meta, StoryObj } from '@storybook/react'
import { EditCollection } from '@/sections/edit-collection/EditCollection'
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

import { ROOT_COLLECTION_ALIAS } from '@tests/e2e-integration/shared/collection/ROOT_COLLECTION_ALIAS'

const meta: Meta<typeof EditCollection> = {
  title: 'Pages/Edit Collection',
  component: EditCollection,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta
type Story = StoryObj<typeof EditCollection>

export const Default: Story = {
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
      collectionRepository={new CollectionMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}
export const Loading: Story = {
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
      collectionRepository={new CollectionLoadingMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}

export const CollectionNotFound: Story = {
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
      collectionRepository={new NoCollectionMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
    />
  )
}

const collectionRepositoryWithoutPermissionsToCreateCollection = new CollectionMockRepository()
collectionRepositoryWithoutPermissionsToCreateCollection.getUserPermissions = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(
        CollectionMother.createUserPermissions({
          canEditCollection: false
        })
      )
    }, FakerHelper.loadingTimout())
  })
}

export const NotAllowedToEditCollection: Story = {
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
      collectionRepository={collectionRepositoryWithoutPermissionsToCreateCollection}
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
    />
  )
}
