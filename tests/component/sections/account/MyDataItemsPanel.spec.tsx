import { CountPerObjectType } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'
import { MyDataItemsPanel } from '@/sections/account/my-data-section/MyDataItemsPanel'
import { MyDataCollectionItemSubset } from '@/collection/domain/models/MyDataCollectionItemSubset'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import { RoleRepository } from '@/roles/domain/repositories/RoleRepository'
import { RoleMother } from '@tests/component/roles/domain/models/RoleMother'
import { WithRepositories } from '@tests/component/WithRepositories'

const collectionRepository: CollectionRepository = {} as CollectionRepository
const roleRepository: RoleRepository = {} as RoleRepository

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

const mountMyDataItemsPanelAuthenticated = () =>
  cy.mountAuthenticated(
    <WithRepositories collectionRepository={collectionRepository}>
      <MyDataItemsPanel roleRepository={roleRepository} />
    </WithRepositories>
  )

const mountMyDataItemsPanelSuperuser = () =>
  cy.mountSuperuser(
    <WithRepositories collectionRepository={collectionRepository}>
      <MyDataItemsPanel roleRepository={roleRepository} />
    </WithRepositories>
  )

describe('MyDataItemsPanel', () => {
  beforeEach(() => {
    cy.viewport(1280, 720)

    collectionRepository.getMyDataItems = cy.stub().resolves(itemsWithCount)
    roleRepository.getUserSelectableRoles = cy.stub().resolves(RoleMother.createManyRealistic())
  })

  it('renders skeleton while loading', () => {
    mountMyDataItemsPanelAuthenticated()

    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders the error message when there is an error', () => {
    roleRepository.getUserSelectableRoles = cy.stub().rejects(new Error('some roles error'))

    mountMyDataItemsPanelAuthenticated()

    cy.findByRole('alert').should('exist').should('contain.text', 'some roles error')
  })

  it('renders the correct role checkboxes', () => {
    mountMyDataItemsPanelAuthenticated()

    cy.findByRole('checkbox', { name: 'Admin' }).should('exist')
    cy.findByRole('checkbox', { name: 'Contributor' }).should('exist')
    cy.findByRole('checkbox', { name: 'Curator' }).should('exist')
    cy.findByRole('checkbox', { name: 'Member' }).should('exist')
    cy.findByRole('checkbox', { name: 'File Downloader' }).should('exist')
    cy.findByRole('checkbox', { name: 'Dataverse + Dataset Creator' }).should('exist')
    cy.findByRole('checkbox', { name: 'Dataverse Creator' }).should('exist')
    cy.findByRole('checkbox', { name: 'Dataset Creator' }).should('exist')
  })

  describe('User Search', () => {
    it('does not render the search input for non-superusers', () => {
      mountMyDataItemsPanelAuthenticated()

      cy.findByPlaceholderText('Search by username...').should('not.exist')
    })

    it('renders the search input for superusers', () => {
      mountMyDataItemsPanelSuperuser()

      cy.findByPlaceholderText('Search by username...')
        .should('exist')
        .invoke('val')
        .should('equal', 'jamespotts')
    })

    it('calls the repository with the default username when rendering', () => {
      mountMyDataItemsPanelSuperuser()
      const otherUsername = 'jamespotts'
      cy.findByPlaceholderText('Search by username...')
        .should('exist')
        .invoke('val')
        .should('equal', otherUsername)

      cy.wrap(collectionRepository.getMyDataItems).should(
        'be.calledWithMatch',
        Cypress.sinon.match.any,
        Cypress.sinon.match.any,
        Cypress.sinon.match.any,
        Cypress.sinon.match.has('pageSize', 10).and(Cypress.sinon.match.has('page', 1)),
        undefined,
        otherUsername
      )
    })
    it('calls the repository with the correct username when searching', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(itemsWithCount)

      mountMyDataItemsPanelSuperuser()

      cy.findByPlaceholderText('Search by username...')
        .should('exist')
        .clear()
        .type('testUserName{enter}')

      cy.wrap(collectionRepository.getMyDataItems).should(
        'be.calledWithMatch',
        Cypress.sinon.match.any,
        Cypress.sinon.match.any,
        Cypress.sinon.match.any,
        Cypress.sinon.match.has('pageSize', 10).and(Cypress.sinon.match.has('page', 1)),
        undefined,
        'testUserName'
      )
    })
    it('shows the correct message when there are no results for user', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      mountMyDataItemsPanelSuperuser()

      cy.findByPlaceholderText('Search by username...').clear().type('testUserName{enter}')

      cy.findByText(/No results found for user testUserName./).should('exist')
    })
  })
  describe('NoItemsMessage', () => {
    it('renders correct no items message when there are no collection, dataset or files', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      mountMyDataItemsPanelAuthenticated()
      cy.findByRole('checkbox', { name: 'Member' }).should('exist')
      cy.findByLabelText(/Files/).should('exist').click()
      cy.findByText(
        /You have not created or contributed to any collections, datasets or files. /
      ).should('exist')
    })

    it('renders correct no items message when there are no collections', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      mountMyDataItemsPanelAuthenticated()
      cy.findByRole('checkbox', { name: 'Member' }).should('exist')

      cy.findByLabelText(/Datasets/)
        .should('exist')
        .click()

      cy.findByText(
        /You have not created or contributed to any collections. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })

    it('renders correct no items message when there are no datasets', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      mountMyDataItemsPanelAuthenticated()
      cy.findByRole('checkbox', { name: 'Member' }).should('exist')

      cy.findByLabelText(/Collections/)
        .should('exist')
        .click()

      cy.findByText(
        /You have not created or contributed to any datasets. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })

    it('renders correct no items message when there are no files', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      mountMyDataItemsPanelAuthenticated()
      cy.findByRole('checkbox', { name: 'Member' }).should('exist')

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

      mountMyDataItemsPanelAuthenticated()
      cy.findByRole('checkbox', { name: 'Member' }).should('exist')

      cy.findByText(
        /You have not created or contributed to any collections or datasets. You can create data by using the Add Data menu option on this page./
      ).should('exist')
    })
    it('renders correct no items message when there are no collections and files', () => {
      collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)

      mountMyDataItemsPanelAuthenticated()
      cy.findByRole('checkbox', { name: 'Member' }).should('exist')

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

      mountMyDataItemsPanelAuthenticated()
      cy.findByRole('checkbox', { name: 'Member' }).should('exist')

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

    mountMyDataItemsPanelAuthenticated()
    cy.findByPlaceholderText('Search my data...').type('example search text')

    cy.findByRole('button', { name: /Search submit/ }).click()

    cy.findByText(/There are no collections, datasets, or files that match your search./).should(
      'exist'
    )
  })

  it('renders the no search results message when there are no items matching the facet filters', () => {
    collectionRepository.getMyDataItems = cy.stub().resolves(emptyItemsWithCount)
    mountMyDataItemsPanelAuthenticated()
    cy.findByLabelText('Unpublished (0)').should('exist').click()
    cy.findByLabelText('Contributor').should('exist').click()
    cy.findByText(/There are no collections, datasets, or files that match your search./).should(
      'exist'
    )
  })

  it('renders error message when there is an error', () => {
    collectionRepository.getMyDataItems = cy.stub().rejects(new Error('some error'))

    mountMyDataItemsPanelAuthenticated()

    cy.findByText('Error').should('exist')
  })

  it('renders the 10 first items', () => {
    mountMyDataItemsPanelAuthenticated()

    cy.findByText('10 of 200 results displayed').should('exist')

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
  })

  it('renders the first 10 items with more to load, showing the bottom loading skeleton', () => {
    mountMyDataItemsPanelAuthenticated()

    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('exist')
  })

  it('renders 10 first items and then loads more items when scrolling to the bottom', () => {
    mountMyDataItemsPanelAuthenticated()

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

    mountMyDataItemsPanelAuthenticated()

    cy.findByText('4 results').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 4)
    cy.findByTestId('collection-items-list-infinite-scroll-skeleton').should('not.exist')
  })

  it('sets Collections and Datasets as default selected when page is rendered', () => {
    mountMyDataItemsPanelAuthenticated()

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
      mountMyDataItemsPanelAuthenticated()

      cy.findByPlaceholderText('Search my data...').type('Some search')
      cy.findByRole('button', { name: /Search submit/ }).click()

      cy.findByPlaceholderText('Search my data...').clear()
      cy.findByRole('button', { name: /Search submit/ }).click()
    })

    it('changes the types correctly without an existing search value', () => {
      mountMyDataItemsPanelAuthenticated()

      cy.findByRole('checkbox', { name: /Files/ }).check()
      cy.findByRole('checkbox', { name: /Collections/ }).uncheck()
      cy.findByRole('checkbox', { name: /Datasets/ }).uncheck()

      cy.findByRole('checkbox', { name: /Collections/ }).check()
      cy.findByRole('checkbox', { name: /Datasets/ }).check()
      cy.findByRole('checkbox', { name: /Files/ }).uncheck()
    })

    it('changes the types correctly with a search value', () => {
      mountMyDataItemsPanelAuthenticated()
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
      mountMyDataItemsPanelAuthenticated()

      cy.findByRole('checkbox', { name: /Contributor/ }).uncheck()
      cy.findByRole('checkbox', { name: /Contributor/ }).check()
    })
    it('changes the publicationStatus correctory correctly', () => {
      mountMyDataItemsPanelAuthenticated()

      cy.findByRole('checkbox', { name: /Draft/ }).uncheck()
      cy.findByRole('checkbox', { name: /Draft/ }).check()
    })
    it('it calls the loadItemsOnBackAndForwardNavigation on pop state event when navigating back and forward', () => {
      mountMyDataItemsPanelAuthenticated()

      cy.window().then((window) => {
        const popStateEvent = new window.PopStateEvent('popstate', {
          state: { yourData: 'example' }
        })

        window.dispatchEvent(popStateEvent)
      })
    })
  })
})
