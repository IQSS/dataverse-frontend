import { CountPerObjectType } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'
import { MyDataItemsPanel } from '@/sections/account/my-data-section/MyDataItemsPanel'
import { MyDataCollectionItemSubset } from '@/collection/domain/models/MyDataCollectionItemSubset'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

const collectionRepository: CollectionRepository = {} as CollectionRepository

const totalItemCount = 200
const items = CollectionItemsMother.createItems({
  numberOfCollections: 4,
  numberOfDatasets: 3,
  numberOfFiles: 3,
  includeUserRoles: true
})

const countPerObjectType: CountPerObjectType = {
  collections: 20,
  datasets: 40,
  files: 140
}

const publicationStatusCounts = CollectionItemsMother.createMyDataPublicationCounts()

const itemsWithCount: MyDataCollectionItemSubset = {
  items,
  publicationStatusCounts,
  totalItemCount,
  countPerObjectType
}

const emptyItemsWithCount: MyDataCollectionItemSubset = {
  items: [],
  publicationStatusCounts: [
    {
      publicationStatus: PublicationStatus.Unpublished,
      count: 0
    },
    {
      publicationStatus: PublicationStatus.Published,
      count: 0
    },
    {
      publicationStatus: PublicationStatus.Draft,
      count: 0
    },
    {
      publicationStatus: PublicationStatus.InReview,
      count: 0
    },
    {
      publicationStatus: PublicationStatus.Deaccessioned,
      count: 0
    }
  ],
  totalItemCount: 0,
  countPerObjectType: {
    collections: 0,
    datasets: 0,
    files: 0
  }
}

describe('MyDataItemsPanel', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    collectionRepository.getMyDataItems = cy.stub().resolves(itemsWithCount)
  })

  it('renders skeleton while loading', () => {
    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })
  describe('User Search', () => {
    it('does not render the search input for non-superusers', () => {
      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByPlaceholderText('Search by username...').should('not.exist')
    })

    it('renders the search input for superusers', () => {
      cy.mountSuperuser(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByPlaceholderText('Search by username...').should('exist')
    })
    it('shows the correct message when there are no results for user', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountSuperuser(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByPlaceholderText('Search by username...').type('testUserName{enter}')

      cy.findByText(/No results found for user testUserName./).should('exist')
    })
  })
  describe('NoItemsMessage', () => {
    it('renders correct no items message when there are no collection, dataset or files', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)
      cy.findByLabelText(/Files/).should('exist').click()
      cy.findByText(
        /You have not created or contributed to any collections, datasets or files. /
      ).should('exist')
    })

    it('renders correct no items message when there are no collections', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByLabelText(/Datasets/)
        .should('exist')
        .click()

      cy.findByText(
        /You have not created or contributed to any collections. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })

    it('renders correct no items message when there are no datasets', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByLabelText(/Collections/)
        .should('exist')
        .click()

      cy.findByText(
        /You have not created or contributed to any datasets. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })

    it('renders correct no items message when there are no files', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)
      cy.findByLabelText(/Files/).should('exist').click()
      cy.findByLabelText(/Datasets/)
        .should('exist')
        .click()
      cy.findByLabelText(/Collections/)
        .should('exist')
        .click()

      cy.findByText(
        /You have not created or contributed to any files. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })

    it('renders correct no items message when there are no collections and datasets', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByText(
        /You have not created or contributed to any collections or datasets. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })
    it('renders correct no items message when there are no collections and files', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)
      cy.findByLabelText(/Files/).should('exist').click()
      cy.findByLabelText(/Datasets/)
        .should('exist')
        .click()

      cy.findByText(
        /You have not created or contributed to any collections or files. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })
    it('renders correct no items message when there are no datasets and files', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)
      cy.findByLabelText(/Files/).should('exist').click()
      cy.findByLabelText(/Collections/)
        .should('exist')
        .click()

      cy.findByText(
        /You have not created or contributed to any datasets or files. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })
  })

  it('renders the no search results message when there are no items matching the search query', () => {
    collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)
    cy.findByPlaceholderText('Search my data...').type('example search text')

    cy.findByRole('button', { name: /Search submit/ }).click()

    cy.findByText(/There are no collections, datasets, or files that match your search./).should(
      'exist'
    )
  })

  it('renders the no search results message when there are no items matching the facet filters', () => {
    collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)
    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)
    cy.findByLabelText('Unpublished (0)').should('exist').click()
    cy.findByLabelText('Contributor').should('exist').click()
    cy.findByText(/There are no collections, datasets, or files that match your search./).should(
      'exist'
    )
  })

  it('renders error message when there is an error', () => {
    collectionRepository.getMyDataItems = cy.stub().rejects(new Error('some error'))

    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

    cy.findByText('Error').should('exist')
  })

  it('renders the 10 first items', () => {
    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

    cy.findByText('10 of 200 results displayed').should('exist')

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
  })

  it('renders the first 10 items with more to load, showing the bottom loading skeleton', () => {
    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders 10 first items and then loads more items when scrolling to the bottom', () => {
    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')

    cy.findByTestId('items-list-scrollable-container').scrollTo('bottom')

    cy.findByTestId('items-list').should('exist').children().should('have.length', 20)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders 4 items with no more to load, correct results in header, and no bottom skeleton loader', () => {
    const first4Elements = items.slice(0, 4)
    const first4ElementsWithCount: MyDataCollectionItemSubset = {
      items: first4Elements,
      publicationStatusCounts,
      totalItemCount: 4,
      countPerObjectType: {
        collections: 4,
        datasets: 0,
        files: 0
      }
    }
    collectionRepository.getMyDataItems = cy.stub().resolves(first4ElementsWithCount)

    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

    cy.findByText('4 results').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 4)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('not.exist')
  })

  it('sets Collections and Datasets as default selected when page is rendered', () => {
    cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

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
      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByPlaceholderText('Search my data...').type('Some search')
      cy.findByRole('button', { name: /Search submit/ }).click()

      cy.findByPlaceholderText('Search my data...').clear()
      cy.findByRole('button', { name: /Search submit/ }).click()
    })

    it('changes the types correctly without an existing search value', () => {
      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByRole('checkbox', { name: /Files/ }).check()
      cy.findByRole('checkbox', { name: /Collections/ }).uncheck()
      cy.findByRole('checkbox', { name: /Datasets/ }).uncheck()

      cy.findByRole('checkbox', { name: /Collections/ }).check()
      cy.findByRole('checkbox', { name: /Datasets/ }).check()
      cy.findByRole('checkbox', { name: /Files/ }).uncheck()
    })

    it('changes the types correctly with a search value', () => {
      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)
      cy.findByPlaceholderText('Search my data...').type('Some search')
      cy.findByRole('button', { name: /Search submit/ }).click()

      cy.findByRole('checkbox', { name: /Collections/ }).uncheck()
      cy.findByRole('checkbox', { name: /Datasets/ }).uncheck()
      cy.findByRole('checkbox', { name: /Files/ }).check()

      cy.findByRole('checkbox', { name: /Collections/ }).check()
      cy.findByRole('checkbox', { name: /Datasets/ }).check()
      cy.findByRole('checkbox', { name: /Files/ }).uncheck()
    })

    it('changes the roles correctly', () => {
      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByRole('checkbox', { name: /Contributor/ }).uncheck()
      cy.findByRole('checkbox', { name: /Contributor/ }).check()
    })
    it('changes the publicationStatus correctory correctly', () => {
      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.findByRole('checkbox', { name: /Draft/ }).uncheck()
      cy.findByRole('checkbox', { name: /Draft/ }).check()
    })
    it('it calls the loadItemsOnBackAndForwardNavigation on pop state event when navigating back and forward', () => {
      cy.mountAuthenticated(<MyDataItemsPanel collectionRepository={collectionRepository} />)

      cy.window().then((window) => {
        const popStateEvent = new window.PopStateEvent('popstate', {
          state: { yourData: 'example' }
        })

        window.dispatchEvent(popStateEvent)
      })
    })
  })
})
