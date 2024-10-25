import { Meta, StoryObj } from '@storybook/react'
import { PublishDatasetModal } from '../../../sections/dataset/publish-dataset/PublishDatasetModal'
import { DatasetMockRepository } from '../DatasetMockRepository'
import { WithI18next } from '../../WithI18next'
import { WithLoggedInSuperUser } from '../../WithLoggedInSuperUser'
import { WithLoggedInUser } from '../../WithLoggedInUser'
import { CollectionMockRepository } from '@/stories/collection/CollectionMockRepository'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'

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
    <PublishDatasetModal
      show={true}
      repository={new DatasetMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      parentCollection={UpwardHierarchyNodeMother.createCollection()}
      persistentId={'test'}
      releasedVersionExists={false}
      handleClose={() => {}}></PublishDatasetModal>
  )
}

export const ReleasedVersionExists: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <PublishDatasetModal
      show={true}
      repository={new DatasetMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      parentCollection={UpwardHierarchyNodeMother.createCollection()}
      persistentId={'test'}
      releasedVersionExists={true}
      nextMinorVersion={'1.1'}
      nextMajorVersion={'2.0'}
      handleClose={() => {}}></PublishDatasetModal>
  )
}
export const UnReleasedCollection: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <PublishDatasetModal
      show={true}
      repository={new DatasetMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      parentCollection={UpwardHierarchyNodeMother.createCollection({ isReleased: false })}
      persistentId={'test'}
      releasedVersionExists={false}
      handleClose={() => {}}></PublishDatasetModal>
  )
}
export const Superuser: Story = {
  decorators: [WithLoggedInSuperUser],
  render: () => (
    <PublishDatasetModal
      show={true}
      repository={new DatasetMockRepository()}
      collectionRepository={new CollectionMockRepository()}
      parentCollection={UpwardHierarchyNodeMother.createCollection()}
      persistentId={'test'}
      releasedVersionExists={true}
      nextMinorVersion={'1.1'}
      nextMajorVersion={'2.0'}
      handleClose={() => {}}></PublishDatasetModal>
  )
}
