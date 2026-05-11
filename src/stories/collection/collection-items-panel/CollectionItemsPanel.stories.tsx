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
import { WithRepositories } from '@/stories/WithRepositories'

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
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      addDataSlot={null}
    />
  )
}

export const WithAllFiltersAndSearchValue: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
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
      addDataSlot={null}
    />
  )
}

export const WithFacetFiltersApplied: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
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
        ],
        filtersQuery: ['dvCategory:Department', 'authorName_ss:Admin, Dataverse']
      }}
      addDataSlot={null}
    />
  )
}

export const WithAddDataButtons: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      addDataSlot={
        <AddDataActionsButton collectionId={'someCollectionId'} canAddCollection canAddDataset />
      }
    />
  )
}

export const LoadingItems: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionLoadingMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      addDataSlot={null}
    />
  )
}

export const NoSearchMatches: Story = {
  decorators: [WithRepositories({ collectionRepository: new NoCollectionMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: 'some search', typesQuery: undefined }}
      addDataSlot={null}
    />
  )
}

export const NoCollectionDatasetsOrFiles: Story = {
  decorators: [WithRepositories({ collectionRepository: new NoCollectionMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: [
          CollectionItemType.COLLECTION,
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ]
      }}
      addDataSlot={null}
    />
  )
}
export const NoCollectionDatasetsOrFilesAuthenticatedUser: Story = {
  decorators: [
    WithLoggedInUser,
    WithRepositories({ collectionRepository: new NoCollectionMockRepository() })
  ],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: [
          CollectionItemType.COLLECTION,
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ]
      }}
      addDataSlot={
        <AddDataActionsButton collectionId={'collectionId'} canAddCollection canAddDataset />
      }
    />
  )
}

export const NoCollections: Story = {
  decorators: [WithRepositories({ collectionRepository: new NoCollectionMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: [CollectionItemType.COLLECTION]
      }}
      addDataSlot={null}
    />
  )
}

export const NoDatasets: Story = {
  decorators: [WithRepositories({ collectionRepository: new NoCollectionMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: [CollectionItemType.DATASET]
      }}
      addDataSlot={null}
    />
  )
}

export const NoFiles: Story = {
  decorators: [WithRepositories({ collectionRepository: new NoCollectionMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{
        pageQuery: 1,
        searchQuery: undefined,
        typesQuery: [CollectionItemType.FILE]
      }}
      addDataSlot={null}
    />
  )
}

export const WithErrorLoadingItems: Story = {
  decorators: [WithRepositories({ collectionRepository: new CollectionErrorMockRepository() })],
  render: () => (
    <CollectionItemsPanel
      collectionId="collectionId"
      collectionQueryParams={{ pageQuery: 1, searchQuery: undefined, typesQuery: undefined }}
      addDataSlot={null}
    />
  )
}
