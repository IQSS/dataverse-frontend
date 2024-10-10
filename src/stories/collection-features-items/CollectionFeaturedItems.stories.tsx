import type { Meta, StoryObj } from '@storybook/react'
import { CollectionFeaturedItems } from '@/sections/collection-featured-items/CollectionFeaturedItems'
import { WithI18next } from '../WithI18next'
import { WithLayout } from '../WithLayout'
import { WithLoggedInUser } from '../WithLoggedInUser'
import { CollectionMockRepository } from '../collection/CollectionMockRepository'

const meta: Meta<typeof CollectionFeaturedItems> = {
  title: 'Pages/Collection Featured Items',
  component: CollectionFeaturedItems,
  decorators: [WithI18next, WithLayout, WithLoggedInUser],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof CollectionFeaturedItems>

export const Default: Story = {
  render: () => (
    <CollectionFeaturedItems
      collectionRepository={new CollectionMockRepository()}
      collectionId="collection"
    />
  )
}
