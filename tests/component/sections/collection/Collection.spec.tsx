import { Collection } from '../../../../src/sections/collection/Collection'
import { CollectionRepository } from '../../../../src/collection/domain/repositories/CollectionRepository'
import { CollectionMother } from '../../collection/domain/models/CollectionMother'

const collectionRepository = {} as CollectionRepository
const collection = CollectionMother.create({ name: 'Collection Name' })
const userPermissionsMock = CollectionMother.createUserPermissions()

describe('Collection page', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
    collectionRepository.getUserPermissions = cy.stub().resolves(userPermissionsMock)
  })

  it('renders skeleton while loading', () => {
    const DELAYED_TIME = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => collection)
    })

    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        collectionId="collection"
        created={false}
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
        collectionId="collection"
        created={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('renders the breadcrumbs', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        collectionId="collection"
        created={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByText('Root').should('exist')
  })

  it('renders collection title', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        collectionId="collection"
        created={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('heading', { name: 'Collection Name' }).should('exist')
  })

  it('does not render the Add Data dropdown button', () => {
    cy.customMount(
      <Collection
        collectionRepository={collectionRepository}
        collectionId="collection"
        created={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )
    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })

  it('does render the Add Data dropdown button when user logged in', () => {
    cy.mountAuthenticated(
      <Collection
        collectionRepository={collectionRepository}
        collectionId="collection"
        created={false}
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
        collectionId="collection"
        created
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByRole('alert').should('exist').should('include.text', 'Success!')
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
        collectionId="collection"
        created={false}
        collectionQueryParams={{ pageQuery: 1 }}
      />
    )

    cy.findByRole('button', { name: /Add Data/i }).should('not.exist')
  })
})
