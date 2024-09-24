import { Meta, StoryObj } from '@storybook/react'
import { CollectionItemsPanel } from '@/sections/collection/collection-items-panel/CollectionItemsPanel'
import { WithI18next } from '@/stories/WithI18next'
import { CollectionMockRepository } from '../CollectionMockRepository'

const meta: Meta<typeof CollectionItemsPanel> = {
  title: 'Sections/Collection Page/CollectionItemsPanel',
  component: CollectionItemsPanel,
  decorators: [WithI18next],
  parameters: {
    // Sets the delay for all stories.
    chromatic: { delay: 15000, pauseAnimationAtEnd: true }
  }
}

export default meta
type Story = StoryObj<typeof CollectionItemsPanel>

export const Default: Story = {
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      collectionRepository={new CollectionMockRepository()}
      addDataSlot={null}
    />
  )
}

// With Add Data Buttons

//Loading, NoResults, Error, Also stories for messages

//
