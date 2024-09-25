import { CollectionItemsPanel } from '@/sections/collection/collection-items-panel/CollectionItemsPanel'
import { ROOT_COLLECTION_ALIAS } from '@/collection/domain/models/Collection'
import {
  CollectionItem,
  CollectionItemSubset
} from '@/collection/domain/models/CollectionItemSubset'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'

const collectionRepository: CollectionRepository = {} as CollectionRepository

const totalItemCount = 200
const items = CollectionItemsMother.createItems({
  numberOfCollections: 4,
  numberOfDatasets: 3,
  numberOfFiles: 3
})

const itemsWithCount: CollectionItemSubset = { items, totalItemCount }

describe('CollectionItemsPanel', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    collectionRepository.getItems = cy.stub().resolves(itemsWithCount)
  })

  it('renders skeleton while loading', () => {
    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders no items message when there are no collection, dataset or files', () => {
    const emptyItems: CollectionItem[] = []
    const emptyItemsWithCount: CollectionItemSubset = { items: emptyItems, totalItemCount: 0 }
    collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByText(/This collection currently has no collections, datasets or files./).should(
      'exist'
    )
  })

  it('renders the no search results message when there are no items matching the search query', () => {
    const emptyItems: CollectionItem[] = []
    const emptyItemsWithCount: CollectionItemSubset = { items: emptyItems, totalItemCount: 0 }
    collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: 'some search',
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByText(/There are no collections, datasets, or files that match your search./).should(
      'exist'
    )
  })

  it('renders error message when there is an error', () => {
    collectionRepository.getItems = cy.stub().rejects(new Error('some error'))

    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByText('Error').should('exist')
  })

  it('renders the 10 first items', () => {
    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByText('10 of 200 results displayed').should('exist')

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
  })

  it('renders the first 10 items with more to load, showing the bottom loading skeleton', () => {
    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders 4 items with no more to load, correct results in header, and no bottom skeleton loader', () => {
    const first4Elements = items.slice(0, 4)
    const first4ElementsWithCount: CollectionItemSubset = {
      items: first4Elements,
      totalItemCount: 4
    }
    collectionRepository.getItems = cy.stub().resolves(first4ElementsWithCount)

    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByText('4 results').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 4)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('not.exist')
  })

  it('sets Collections and Datasets as default selected when no types query param is passed', () => {
    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByRole('checkbox', { name: /Collections/ }).should('be.checked')
    cy.findByRole('checkbox', { name: /Datasets/ }).should('be.checked')
    cy.findByRole('checkbox', { name: /Files/ }).should('not.be.checked')
  })
})
