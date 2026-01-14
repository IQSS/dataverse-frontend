import type { Meta, StoryObj } from '@storybook/react'
import { EditDatasetTemplateMetadata } from '@/sections/templates/edit-template-metadata'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { TemplateMockRepository } from './TemplateMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockLoadingRepository'

const meta: Meta<typeof EditDatasetTemplateMetadata> = {
  title: 'Pages/Edit Template Metadata',
  component: EditDatasetTemplateMetadata,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof EditDatasetTemplateMetadata>

export const Default: Story = {
  render: () => (
    <EditDatasetTemplateMetadata
      collectionId="root"
      templateId={1}
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <EditDatasetTemplateMetadata
      collectionId="root"
      templateId={1}
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}
