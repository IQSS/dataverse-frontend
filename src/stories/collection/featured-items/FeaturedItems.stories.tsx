import { Meta, StoryObj } from '@storybook/react'
import { WithI18next } from '@/stories/WithI18next'
import { FeaturedItems } from '@/sections/collection/featured-items/FeaturedItems'
import { CollectionMockRepository } from '../CollectionMockRepository'
import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'
import { FakerHelper } from '@tests/component/shared/FakerHelper'

const collectionRepositoryWithFeaturedItems = new CollectionMockRepository()

collectionRepositoryWithFeaturedItems.getFeaturedItems = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(FeaturedItemMother.createFeaturedItems())
    }, FakerHelper.loadingTimout())
  })
}

const meta: Meta<typeof FeaturedItems> = {
  title: 'Sections/Collection Page/Featured Items',
  component: FeaturedItems,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof FeaturedItems>

export const Default: Story = {
  render: () => (
    <FeaturedItems
      collectionRepository={collectionRepositoryWithFeaturedItems}
      collectionId="testAlias"
    />
  )
}
