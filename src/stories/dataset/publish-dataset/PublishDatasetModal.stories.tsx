import { Meta, StoryObj } from '@storybook/react'
import { PublishDatasetModal } from '../../../sections/dataset/publish-dataset/PublishDatasetModal'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInSuperUser } from '../../WithLoggedInSuperUser'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import { CustomTermsMother } from '@tests/component/dataset/domain/models/TermsOfUseMother'
import { LicenseMother } from '@tests/component/dataset/domain/models/LicenseMother'
import { WithSettings } from '@/stories/WithSettings'
import { RepositoriesStoryProvider } from '@/stories/WithRepositories'

const meta: Meta<typeof PublishDatasetModal> = {
  title: 'Sections/Dataset Page/PublishDatasetModal',
  component: PublishDatasetModal,
  decorators: [WithI18next]
}

export default meta

type Story = StoryObj<typeof PublishDatasetModal>

export const Default: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection()}
        persistentId={'test'}
        license={LicenseMother.create()}
        customTerms={undefined}
        releasedVersionExists={false}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}

export const ReleasedVersionExists: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection()}
        license={LicenseMother.create()}
        customTerms={undefined}
        persistentId={'test'}
        releasedVersionExists={true}
        nextMinorVersion={'1.1'}
        nextMajorVersion={'2.0'}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}
export const UnReleasedCollection: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection({ isReleased: false })}
        license={LicenseMother.create()}
        customTerms={undefined}
        persistentId={'test'}
        releasedVersionExists={false}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}
export const Superuser: Story = {
  decorators: [WithLoggedInSuperUser],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection()}
        license={LicenseMother.create()}
        customTerms={undefined}
        persistentId={'test'}
        releasedVersionExists={true}
        nextMinorVersion={'1.1'}
        nextMajorVersion={'2.0'}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}
export const RequiresMajorVersionUpdate: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection()}
        persistentId={'test'}
        releasedVersionExists={true}
        license={LicenseMother.create()}
        customTerms={undefined}
        nextMinorVersion={'1.1'}
        nextMajorVersion={'2.0'}
        requiresMajorVersionUpdate={true}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}
export const WithCustomTerms: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection()}
        persistentId={'test'}
        license={undefined}
        customTerms={CustomTermsMother.create()}
        releasedVersionExists={false}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}
export const withTextSettings: Story = {
  decorators: [WithLoggedInUser, WithSettings],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection()}
        persistentId={'test'}
        license={LicenseMother.create()}
        customTerms={undefined}
        releasedVersionExists={false}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}
export const withTextSettingsAndCustomTerms: Story = {
  decorators: [WithLoggedInUser, WithSettings],
  render: () => (
    <RepositoriesStoryProvider collectionRepository={new CollectionMockRepository()}>
      <PublishDatasetModal
        show={true}
        repository={new DatasetMockRepository()}
        parentCollection={UpwardHierarchyNodeMother.createCollection()}
        persistentId={'test'}
        license={undefined}
        customTerms={CustomTermsMother.create()}
        releasedVersionExists={false}
        handleClose={() => {}}></PublishDatasetModal>
    </RepositoriesStoryProvider>
  )
}
