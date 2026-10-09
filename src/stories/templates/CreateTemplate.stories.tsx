import type { Meta, StoryObj } from '@storybook/react'
import { CreateTemplate } from '@/sections/templates/create-template/CreateTemplate'
import { WithLayout } from '../WithLayout'
import { WithI18next } from '../WithI18next'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../collection/CollectionLoadingMockRepository'
import { TemplateMockRepository } from './TemplateMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'
import { MetadataBlockInfoMockLoadingRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockLoadingRepository'

const meta: Meta<typeof CreateTemplate> = {
  title: 'Pages/Create Template',
  component: CreateTemplate,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}
export default meta

type Story = StoryObj<typeof CreateTemplate>

export const Default: Story = {
  render: () => (
    <CreateTemplate
      collectionId="root"
      collectionRepository={new CollectionMockRepository()}
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}

export const Loading: Story = {
  render: () => (
    <CreateTemplate
      collectionId="root"
      collectionRepository={new CollectionLoadingMockRepository()}
      templateRepository={new TemplateMockRepository()}
      metadataBlockInfoRepository={new MetadataBlockInfoMockLoadingRepository()}
    />
  )
}
