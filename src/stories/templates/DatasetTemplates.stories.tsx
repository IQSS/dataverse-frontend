import type { Meta, StoryObj } from '@storybook/react'
import { DatasetTemplates } from '@/sections/templates/DatasetTemplates'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { WithNotImplementedModal } from '../WithNotImplementedModal'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../collection/CollectionLoadingMockRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { UpwardHierarchyNodeMother } from '@tests/component/shared/hierarchy/domain/models/UpwardHierarchyNodeMother'
import { TemplateMockRepository } from './TemplateMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { Template } from '@/templates/domain/models/Template'
import { TemplateMother } from '@tests/component/sections/templates/TemplateMother'

const meta: Meta<typeof DatasetTemplates> = {
  title: 'Pages/Dataset Templates',
  component: DatasetTemplates,
  decorators: [WithI18next, WithLayout, WithLoggedInUser, WithNotImplementedModal],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof DatasetTemplates>

class EmptyTemplateMockRepository extends TemplateMockRepository {
  getTemplatesByCollectionId(_collectionIdOrAlias: number | string): Promise<Template[]> {
    return Promise.resolve([])
  }
}

class TemplateLoadingMockRepository extends TemplateMockRepository {
  getTemplatesByCollectionId(_collectionIdOrAlias: number | string): Promise<Template[]> {
    return new Promise(() => {})
  }
}

class TemplateErrorMockRepository extends TemplateMockRepository {
  getTemplatesByCollectionId(_collectionIdOrAlias: number | string): Promise<Template[]> {
    return Promise.reject(new Error('Load failed'))
  }
}

class CollectionWithParentMockRepository extends CollectionMockRepository {
  getById(): Promise<ReturnType<typeof CollectionMother.create>> {
    return Promise.resolve(
      CollectionMother.create({
        name: 'Subcollection',
        id: 'subcollection',
        hierarchy: UpwardHierarchyNodeMother.createSubCollection({
          name: 'Subcollection',
          id: 'subcollection'
        })
      })
    )
  }

  getUserPermissions(): Promise<ReturnType<typeof CollectionMother.createUserPermissions>> {
    return Promise.resolve(
      CollectionMother.createUserPermissions({
        canEditCollection: true
      })
    )
  }
}

class TemplateWithParentMockRepository extends TemplateMockRepository {
  getTemplatesByCollectionId(_collectionIdOrAlias: number | string): Promise<Template[]> {
    return Promise.resolve([
      TemplateMother.create({
        id: 1,
        name: 'Local Template',
        collectionAlias: 'subcollection',
        createDate: 'Sep 2, 2025',
        usageCount: 3,
        isDefault: false,
        createTime: 'Tue Sep 02 13:13:47 UTC 2025'
      }),
      TemplateMother.create({
        id: 2,
        name: 'Root Template',
        collectionAlias: 'root',
        createDate: 'Sep 1, 2025',
        usageCount: 8,
        isDefault: true,
        createTime: 'Mon Sep 01 13:13:47 UTC 2025'
      })
    ])
  }
}

export const Default: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionId="root"
    />
  )
}

export const EmptyState: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new EmptyTemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionId="root"
    />
  )
}

export const LoadingState: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionLoadingMockRepository()}
      templateRepository={new TemplateLoadingMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionId="root"
    />
  )
}

export const ErrorState: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new TemplateErrorMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionId="root"
    />
  )
}

export const WithEditPermission: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionWithParentMockRepository()}
      templateRepository={new TemplateWithParentMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionId="subcollection"
    />
  )
}
