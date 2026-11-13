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
import { RepositoriesStoryProvider, WithRepositories } from '../WithRepositories'
import { SessionContext } from '@/sections/session/SessionContext'
import { UserMother } from '@tests/component/users/domain/models/UserMother'

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

const createScienceCollectionRepository = () => {
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

  return collectionRepo
}

export const Default: Story = {
  render: () => {
    const collectionRepo = createScienceCollectionRepository()

    return (
      <RepositoriesStoryProvider collectionRepository={collectionRepo}>
        <EditCollection
          collectionId="science"
          metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
        />
      </RepositoriesStoryProvider>
    )
  }
}

export const SuperUserWithStorageDriver: Story = {
  render: () => {
    const collectionRepo = createScienceCollectionRepository()
    collectionRepo.getAllowedStorageDrivers = () => {
      return Promise.resolve({
        s3: 's3',
        file1: 'FileSystem'
      })
    }
    collectionRepo.getStorageDriver = (_collectionIdOrAlias, getEffective) => {
      if (!getEffective) {
        return Promise.resolve(undefined)
      }

      return Promise.resolve({
        name: 's3',
        type: 's3',
        label: 's3',
        directUpload: true,
        directDownload: true,
        uploadOutOfBand: false
      })
    }

    return (
      <SessionContext.Provider
        value={{
          user: UserMother.createSuperUser(),
          setUser: () => {},
          isLoadingUser: false,
          sessionError: null,
          refetchUserSession: () => Promise.resolve()
        }}>
        <RepositoriesStoryProvider collectionRepository={collectionRepo}>
          <EditCollection
            collectionId="science"
            metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
          />
        </RepositoriesStoryProvider>
      </SessionContext.Provider>
    )
  }
}

export const EditingRoot: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const Loading: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionLoadingMockRepository() })],
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}

export const CollectionNotFound: Story = {
  decorators: [WithRepositories({ collectionRepository: new NoCollectionMockRepository() })],
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
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
  decorators: [
    WithRepositories({
      collectionRepository: collectionRepositoryWithoutPermissionsToCreateCollection
    })
  ],
  render: () => (
    <EditCollection
      collectionId={ROOT_COLLECTION_ALIAS}
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
    />
  )
}
