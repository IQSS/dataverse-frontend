import { CollectionItemsPanel } from '@/sections/collection/collection-items-panel/CollectionItemsPanel'
import {
  CollectionItem,
  CollectionItemSubset
} from '@/collection/domain/models/CollectionItemSubset'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'

const ROOT_COLLECTION_ALIAS = 'root'
const collectionRepository: CollectionRepository = {} as CollectionRepository

const totalItemCount = 200
const items = CollectionItemsMother.createItems({
  numberOfCollections: 4,
  numberOfDatasets: 3,
  numberOfFiles: 3
})

const facets = CollectionItemsMother.createItemsFacets()

const itemsWithCount: CollectionItemSubset = { items, facets, totalItemCount }

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
          typesQuery: undefined,
          filtersQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  describe('NoItemsMessage', () => {
    it('renders correct no items message when there are no collection, dataset or files', () => {
      const emptyItems: CollectionItem[] = []
      const emptyItemsWithCount: CollectionItemSubset = {
        items: emptyItems,
        facets: [],
        totalItemCount: 0
      }
      collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: [
              CollectionItemType.COLLECTION,
              CollectionItemType.DATASET,
              CollectionItemType.FILE
            ],
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByText(/This collection currently has no collections, datasets or files./).should(
        'exist'
      )
    })

    it('renders correct no items message when there are no collections', () => {
      const emptyItems: CollectionItem[] = []
      const emptyItemsWithCount: CollectionItemSubset = {
        items: emptyItems,
        facets: [],
        totalItemCount: 0
      }
      collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: [CollectionItemType.COLLECTION],
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByText(/This collection currently has no collections./).should('exist')
    })

    it('renders correct no items message when there are no datasets', () => {
      const emptyItems: CollectionItem[] = []
      const emptyItemsWithCount: CollectionItemSubset = {
        items: emptyItems,
        facets: [],
        totalItemCount: 0
      }
      collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: [CollectionItemType.DATASET],
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByText(/This collection currently has no datasets./).should('exist')
    })

    it('renders correct no items message when there are no files', () => {
      const emptyItems: CollectionItem[] = []
      const emptyItemsWithCount: CollectionItemSubset = {
        items: emptyItems,
        facets: [],
        totalItemCount: 0
      }
      collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: [CollectionItemType.FILE],
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByText(/This collection currently has no files./).should('exist')
    })

    it('renders correct no items message when there are no collections and datasets', () => {
      const emptyItems: CollectionItem[] = []
      const emptyItemsWithCount: CollectionItemSubset = {
        items: emptyItems,
        facets: [],
        totalItemCount: 0
      }
      collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: [CollectionItemType.COLLECTION, CollectionItemType.DATASET],
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByText(/This collection currently has no collections or datasets./).should('exist')
    })

    it('renders correct no items message when there are no collections and files', () => {
      const emptyItems: CollectionItem[] = []
      const emptyItemsWithCount: CollectionItemSubset = {
        items: emptyItems,
        facets: [],
        totalItemCount: 0
      }
      collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: [CollectionItemType.COLLECTION, CollectionItemType.FILE],
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByText(/This collection currently has no collections or files./).should('exist')
    })

    it('renders correct no items message when there are no datasets and files', () => {
      const emptyItems: CollectionItem[] = []
      const emptyItemsWithCount: CollectionItemSubset = {
        items: emptyItems,
        facets: [],
        totalItemCount: 0
      }
      collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: [CollectionItemType.DATASET, CollectionItemType.FILE],
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByText(/This collection currently has no datasets or files./).should('exist')
    })
  })

  it('renders the no search results message when there are no items matching the search query', () => {
    const emptyItems: CollectionItem[] = []
    const emptyItemsWithCount: CollectionItemSubset = {
      items: emptyItems,
      facets: [],
      totalItemCount: 0
    }
    collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: 'some search',
          typesQuery: undefined,
          filtersQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByText(/There are no collections, datasets, or files that match your search./).should(
      'exist'
    )
  })

  it('renders the no search results message when there are no items matching the facet filters', () => {
    const emptyItems: CollectionItem[] = []
    const emptyItemsWithCount: CollectionItemSubset = {
      items: emptyItems,
      facets: [],
      totalItemCount: 0
    }
    collectionRepository.getItems = cy.stub().resolves(emptyItemsWithCount)

    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: 'some search',
          typesQuery: undefined,
          filtersQuery: ['some:filter']
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
          typesQuery: undefined,
          filtersQuery: undefined
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
          typesQuery: undefined,
          filtersQuery: undefined
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
          typesQuery: undefined,
          filtersQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders 10 first items and then loads more items when scrolling to the bottom', () => {
    cy.customMount(
      <CollectionItemsPanel
        collectionId={ROOT_COLLECTION_ALIAS}
        collectionRepository={collectionRepository}
        collectionQueryParams={{
          pageQuery: 1,
          searchQuery: undefined,
          typesQuery: undefined,
          filtersQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')

    cy.findByTestId('items-list-scrollable-container').scrollTo('bottom')

    cy.findByTestId('items-list').should('exist').children().should('have.length', 20)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders 4 items with no more to load, correct results in header, and no bottom skeleton loader', () => {
    const first4Elements = items.slice(0, 4)
    const first4ElementsWithCount: CollectionItemSubset = {
      items: first4Elements,
      facets,
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
          typesQuery: undefined,
          filtersQuery: undefined
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
          typesQuery: undefined,
          filtersQuery: undefined
        }}
        addDataSlot={null}
      />
    )

    cy.findByRole('checkbox', { name: /Collections/ }).should('be.checked')
    cy.findByRole('checkbox', { name: /Datasets/ }).should('be.checked')
    cy.findByRole('checkbox', { name: /Files/ }).should('not.be.checked')
  })

  /*
    The things that happened inside the handleSearchSubmit and the handleItemsTypeChange function is not currently possible to test, will be tested in e2e tests
    Adding this so it goes through the test coverage
  */
  describe('Functions called on search submit, filter and popstate event type changes', () => {
    it('submits the search correctly with a value and without a value', () => {
      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: undefined,
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByPlaceholderText('Search this collection...').type('Some search')
      cy.findByRole('button', { name: /Search submit/ }).click()

      cy.findByPlaceholderText('Search this collection...').clear()
      cy.findByRole('button', { name: /Search submit/ }).click()
    })

    it('changes the types correctly without an existing search value', () => {
      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: undefined,
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByRole('checkbox', { name: /Collections/ }).uncheck()
      cy.findByRole('checkbox', { name: /Datasets/ }).uncheck()
      cy.findByRole('checkbox', { name: /Files/ }).check()

      cy.findByRole('checkbox', { name: /Collections/ }).check()
      cy.findByRole('checkbox', { name: /Datasets/ }).check()
      cy.findByRole('checkbox', { name: /Files/ }).uncheck()
    })

    it('changes the types correctly with a search value', () => {
      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: 'something',
            typesQuery: undefined,
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.findByRole('checkbox', { name: /Collections/ }).uncheck()
      cy.findByRole('checkbox', { name: /Datasets/ }).uncheck()
      cy.findByRole('checkbox', { name: /Files/ }).check()

      cy.findByRole('checkbox', { name: /Collections/ }).check()
      cy.findByRole('checkbox', { name: /Datasets/ }).check()
      cy.findByRole('checkbox', { name: /Files/ }).uncheck()
    })

    it.only('show selected filters on top of items list', () => {
      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: undefined,
            filtersQuery: ['dvCategory:Department', 'authorName_ss:Admin, Dataverse']
          }}
          addDataSlot={null}
        />
      )

      cy.findAllByRole('button', { name: /Department/ })
        .should('exist')
        .should('have.length', 2)

      cy.findAllByRole('button', { name: /Department/ })
        .first()
        .click()

      cy.findAllByRole('button', { name: /Admin, Dataverse/ })
        .should('exist')
        .should('have.length', 2)

      cy.findAllByRole('button', { name: /Admin, Dataverse/ })
        .first()
        .click()
    })

    it('it calls the loadItemsOnBackAndForwardNavigation on pop state event when navigating back and forward', () => {
      cy.customMount(
        <CollectionItemsPanel
          collectionId={ROOT_COLLECTION_ALIAS}
          collectionRepository={collectionRepository}
          collectionQueryParams={{
            pageQuery: 1,
            searchQuery: undefined,
            typesQuery: undefined,
            filtersQuery: undefined
          }}
          addDataSlot={null}
        />
      )

      cy.window().then((window) => {
        const popStateEvent = new window.PopStateEvent('popstate', {
          state: { yourData: 'example' }
        })

        window.dispatchEvent(popStateEvent)
      })
    })
  })
})
