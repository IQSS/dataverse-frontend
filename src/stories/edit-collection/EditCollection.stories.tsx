import { Meta, StoryObj } from '@storybook/react'
import { EditCollection } from '@/sections/edit-collection/EditCollection'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../collection/CollectionLoadingMockRepository'
import { NoCollectionMockRepository } from '../collection/NoCollectionMockRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'
import { ROOT_COLLECTION_ALIAS } from '@tests/e2e-integration/shared/collection/ROOT_COLLECTION_ALIAS'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockLoadingRepository'
import { MetadataBlockInfoMockErrorRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockErrorRepository'

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
  render: () => {
    const collectionRepo = new CollectionMockRepository()
    collectionRepo.getById = () => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(
            CollectionMother.create({
              id: 'science',
              isReleased: true,
              name: 'Collection Name',
              description: 'We do all the science.',
              affiliation: 'Scientific Research University',
              hierarchy: UpwardHierarchyNodeMother.createCollection({
                id: 'science',
                name: 'Collection Name',
                parent: UpwardHierarchyNodeMother.createCollection({
                  id: ROOT_COLLECTION_ALIAS,
                  name: 'Root'
                })
              })
            })
          )
        }, FakerHelper.loadingTimout())
      })
    }

    return (
      <EditCollection
        collectionId="science"
        collectionRepository={collectionRepo}
        metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      />
    )
  }
}

export const EditingRoot: Story = {
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
