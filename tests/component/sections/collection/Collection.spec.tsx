import { Collection } from '@/sections/collection/Collection'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'
import { CollectionItemSubset } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { ContactRepository } from '@/contact/domain/repositories/ContactRepository'

const collectionRepository = {} as CollectionRepository
const contactRepository = {} as ContactRepository
const collection = CollectionMother.create({ name: 'Collection Name' })
const userPermissionsMock = CollectionMother.createUserPermissions()

const items = CollectionItemsMother.createItems({
  numberOfCollections: 4,
  numberOfDatasets: 3,
  numberOfFiles: 3
})

const facets = CollectionItemsMother.createItemsFacets()

const itemsWithCount: CollectionItemSubset = { items, facets, totalItemCount: 200 }

describe('Collection page', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)
    collectionRepository.getItems = cy.stub().resolves(itemsWithCount)
    collectionRepository.getFeaturedItems = cy.stub().resolves([])
    contactRepository.sendFeedbacktoOwners = cy.stub().resolves([])
  })

  it('renders skeleton while loading', () => {
    const DELAYED_TIME = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => collection)
    })

    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.clock()

    cy.findByTestId('collection-skeleton').should('exist')
    cy.findByRole('heading', { name: 'Collection Name' }).should('not.exist')

    cy.tick(DELAYED_TIME)

    cy.findByTestId('collection-skeleton').should('not.exist')
    cy.findByRole('heading', { name: 'Collection Name' }).should('exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('renders page not found when collection is undefined', () => {
    collectionRepository.getById = cy.stub().resolves(undefined)
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByTestId('not-found-page').should('exist')
  })

  it('renders the breadcrumbs', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByText('Root').should('exist')
  })

  it('renders collection title', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('heading', { name: 'Collection Name' }).should('exist')
  })

  it('does not render the Add Data dropdown button', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })

  it('does render the Add Data dropdown button when user logged in', () => {
    cy.mountAuthenticated(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByRole('button', { name: /Add Data/i })
      .should('exist')
      .click()
    cy.findByText('New Collection').should('be.visible')
    cy.findByText('New Dataset').should('be.visible')
  })

  it('shows the created alert when the collection was just created', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByRole('alert').should('exist').should('include.text', 'Success!')
  })
  it('shows the published alert when the collection was just published', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={true}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByRole('alert').should('exist').should('include.text', 'Your collection is now public')
  })

  it('hides the Add data dropdown button when user does not have permissions to create both a collection and a dataset', () => {
    collectionRepository.getUserPermissions = cy.stub().resolves(
      CollectionMother.createUserPermissions({
        canAddCollection: false,
        canAddDataset: false
      })
    )

    cy.mountAuthenticated(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })

  it('opens and close the publish collection modal', () => {
    cy.viewport(1200, 800)
    const collection = CollectionMother.createUnpublished()

    collectionRepository.getById = cy.stub().resolves(collection)

    cy.mountAuthenticated(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('button', { name: /Publish/i }).should('exist')

    cy.findByRole('button', { name: /Publish/i }).click()
    cy.findByText('Publish Collection').should('exist')

    cy.findByRole('button', { name: /Cancel/i }).click()
    cy.findByText('Publish Collection').should('not.exist')
  })

  it('opens and close the share collection modal', () => {
    cy.viewport(1200, 800)

    cy.mountAuthenticated(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('button', { name: /Share/i }).should('exist')

    cy.findByRole('button', { name: /Share/i }).click()
    cy.findByText('Share this collection on your favorite social media networks.').should('exist')

    cy.findAllByRole('button', { name: /Close/i }).last().click()
    cy.findByText('Share this collection on your favorite social media networks.').should(
      'not.exist'
    )
  })

  it('shows the collection featured items carousel when there are featured items', () => {
    const featuredItems = CollectionFeaturedItemMother.createFeaturedItems()
    collectionRepository.getFeaturedItems = cy.stub().resolves(featuredItems)

    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByTestId('featured-items').should('exist')
  })

  it('does not show the collection featured items carousel when there are no featured items', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves([])

    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByTestId('featured-items').should('not.exist')
  })

  it('opens and colses contact modal', () => {
    cy.viewport(1200, 800)

    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('button', { name: /Contact/i }).click()
    cy.findByText('Contact').should('exist')
    cy.findByRole('dialog').should('exist')
    cy.findByTestId('fromEmail').should('exist')
    cy.findByText('Email Collection Contact').should('exist')
    cy.findByTestId('body').should('exist')
    cy.findByText('Close').click()
    cy.findByRole('dialog').should('not.exist')
  })

  it('show the tooltip for contact button', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByRole('button', { name: /Contact/i })
      .should('exist')
      .trigger('mouseover')

    cy.findByRole('tooltip').should('be.visible').and('have.text', 'Email Collection Contact')
  })

  it('shows the toast when the information was sent to contact successfully', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        contactRepository={contactRepository}
        collectionIdFromParams="collection"
        created={false}
        published={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('button', { name: /Contact/i })
      .should('exist')
      .click()
    cy.findByTestId('captchaNumbers')
      .invoke('text')
      .then((text) => {
        const matches = text.match(/(\d+)\s*\+\s*(\d+)\s*=/)
        if (matches) {
          const num1 = parseInt(matches[1], 10)
          const num2 = parseInt(matches[2], 10)
          const answer = num1 + num2
          cy.findByTestId('fromEmail').type('email@dataverse.com')
          cy.findByTestId('subject').type('subject')
          cy.findByTestId('body').type('message')
          cy.findByTestId('captchaInput').type(answer.toString())
          cy.findByText('Submit').click()
        }
      })
    cy.findByTestId('dialog').should('not.exist')
    cy.findByText(/Message sent./).should('exist')
  })
})
