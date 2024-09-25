import { Meta, StoryObj } from '@storybook/react'
import { CollectionItemsPanel } from '@/sections/collection/collection-items-panel/CollectionItemsPanel'
import AddDataActionsButton from '@/sections/shared/add-data-actions/AddDataActionsButton'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { WithI18next } from '@/stories/WithI18next'
import { WithLoggedInUser } from '@/stories/WithLoggedInUser'
import { CollectionMockRepository } from '../CollectionMockRepository'
import { CollectionLoadingMockRepository } from '../CollectionLoadingMockRepository'
import { NoCollectionMockRepository } from '../NoCollectionMockRepository'
import { CollectionErrorMockRepository } from '../CollectionErrorMockRepository'

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

export const WithAllFiltersAndSearchValue: Story = {
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: 'some search',
        typesQuery: [
          CollectionItemType.COLLECTION,
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ]
      }}
      collectionRepository={new CollectionMockRepository()}
      addDataSlot={null}
    />
  )
}

export const WithAddDataButtons: Story = {
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      collectionRepository={new CollectionMockRepository()}
      addDataSlot={
        <AddDataActionsButton collectionId={'someCollectionId'} canAddCollection canAddDataset />
      }
    />
  )
}

export const LoadingItems: Story = {
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      collectionRepository={new CollectionLoadingMockRepository()}
      addDataSlot={null}
    />
  )
}

export const NoSearchMatches: Story = {
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: 'some search', typesQuery: undefined }}
      collectionRepository={new NoCollectionMockRepository()}
      addDataSlot={null}
    />
  )
}

export const NoCollectionDatasetsOrFilesAnonymousUser: Story = {
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      collectionRepository={new NoCollectionMockRepository()}
      addDataSlot={null}
    />
  )
}

export const NoCollectionDatasetsOrFilesAuthenticatedUser: Story = {
  decorators: [WithLoggedInUser],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      collectionRepository={new NoCollectionMockRepository()}
      addDataSlot={
        <AddDataActionsButton collectionId={'collectionId'} canAddCollection canAddDataset />
      }
    />
  )
}

export const WithErrorLoadingItems: Story = {
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      collectionRepository={new CollectionErrorMockRepository()}
      addDataSlot={null}
    />
  )
}
