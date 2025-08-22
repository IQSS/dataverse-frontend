import { AdvancedSearch } from '@/sections/advanced-search/AdvancedSearch'
import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'
import { MetadataBlockInfoMockRepository } from '../shared-mock-repositories/metadata-block-info/MetadataBlockInfoMockRepository'

const meta: Meta<typeof AdvancedSearch> = {
  title: 'Pages/Advanced Search',
  component: AdvancedSearch,
  decorators: [WithI18next, WithLayout],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof AdvancedSearch>

export const Default: Story = {
  render: () => (
    <AdvancedSearch
      collectionRepository={new CollectionMockRepository()}
      collectionId="root"
      metadataBlockInfoRepository={new MetadataBlockInfoMockRepository()}
    />
  )
}
