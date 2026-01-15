import type { Meta, StoryObj } from '@storybook/react'
import { DatasetTemplates } from '@/sections/templates/DatasetTemplates'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { WithNotImplementedModal } from '../WithNotImplementedModal'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../collection/CollectionLoadingMockRepository'
import { TemplateMockRepository } from './TemplateMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { Template } from '@/templates/domain/models/Template'

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

export const Default: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionIdFromParams="root"
    />
  )
}

export const EmptyState: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new EmptyTemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionIdFromParams="root"
    />
  )
}

export const Loading: Story = {
  render: () => (
    <DatasetTemplates
      collectionRepository={new CollectionLoadingMockRepository()}
      templateRepository={new TemplateLoadingMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
      collectionIdFromParams="root"
    />
  )
}
