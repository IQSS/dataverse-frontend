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
import { RepositoriesStoryProvider, WithRepositories } from '../WithRepositories'
import { SessionContext } from '@/sections/session/SessionContext'
import { UserMother } from '@tests/component/users/domain/models/UserMother'

import { ROOT_COLLECTION_ALIAS } from '@tests/e2e-integration/shared/collection/ROOT_COLLECTION_ALIAS'

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
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => (
    <CreateCollection
      parentCollectionId={ROOT_COLLECTION_ALIAS}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

const collectionRepositoryWithStorageDrivers = new CollectionMockRepository()
collectionRepositoryWithStorageDrivers.getAllowedStorageDrivers = () => {
  return Promise.resolve({
    s3: 's3',
    file1: 'FileSystem'
  })
}
collectionRepositoryWithStorageDrivers.getStorageDriver = () => {
  return Promise.resolve({
    name: 's3',
    type: 's3',
    label: 's3',
    directUpload: true,
    directDownload: true,
    uploadOutOfBand: false
  })
}

const collectionRepositoryWithInheritedStorageDriver = new CollectionMockRepository()
collectionRepositoryWithInheritedStorageDriver.getAllowedStorageDrivers = () => {
  return Promise.resolve({
    s3: 's3',
    file1: 'FileSystem'
  })
}
collectionRepositoryWithInheritedStorageDriver.getStorageDriver = (
  _collectionIdOrAlias,
  getEffective
) => {
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

export const SuperUserWithStorageDriver: Story = {
  render: () => (
    <SessionContext.Provider
      value={{
        user: UserMother.createSuperUser(),
        setUser: () => {},
        isLoadingUser: false,
        sessionError: null,
        refetchUserSession: () => Promise.resolve()
      }}>
      <RepositoriesStoryProvider collectionRepository={collectionRepositoryWithStorageDrivers}>
        <CreateCollection
          parentCollectionId={ROOT_COLLECTION_ALIAS}
          metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
        />
      </RepositoriesStoryProvider>
    </SessionContext.Provider>
  )
}

export const Loading: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionLoadingMockRepository() })],
  render: () => (
    <CreateCollection
      parentCollectionId={ROOT_COLLECTION_ALIAS}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}

export const ParentCollectionNotFound: Story = {
  decorators: [WithRepositories({ collectionRepository: new NoCollectionMockRepository() })],
  render: () => (
    <CreateCollection
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
      parentCollectionId={ROOT_COLLECTION_ALIAS}
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
  decorators: [
    WithRepositories({
      collectionRepository: collectionRepositoryWithoutPermissionsToCreateCollection
    })
  ],
  render: () => (
    <CreateCollection
      metadataBlockInfoRepository={new MetadataBlockInfoMockErrorRepository()}
      parentCollectionId={ROOT_COLLECTION_ALIAS}
    />
  )
}
