import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { EditCollectionFeaturedItems } from '@/sections/edit-collection-featured-items/EditCollectionFeaturedItems'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'

const collectionRepository = {} as CollectionRepository
const collection = CollectionMother.create({ name: 'Collection Name' })

const featuredItemOne = CollectionFeaturedItemMother.createFeaturedItem({
  id: 'item-1-id',
  type: 'custom',
  imageUrl: 'https://via.placeholder.com/400x400',
  order: 1,
  content: '<h1 class="rte-heading">Featured Item One</h1>'
})

const featuredItemTwo = CollectionFeaturedItemMother.createFeaturedItem({
  id: 'item-2-id',
  type: 'custom',
  order: 2,
  content: '<h1 class="rte-heading">Featured Item Two</h1>',
  imageUrl: undefined
})

describe('EditCollectionFeaturedItems', () => {
  beforeEach(() => {
    collectionRepository.getById = cy.stub().resolves(collection)
    collectionRepository.getFeaturedItems = cy.stub().resolves([featuredItemOne, featuredItemTwo])
  })

  it('should show page not found when collection does not exist', () => {
    collectionRepository.getById = cy.stub().resolves(undefined)

    cy.mountAuthenticated(
      <EditCollectionFeaturedItems
        collectionIdFromParams="root"
        collectionRepository={collectionRepository}
      />
    )

    cy.findByText('Page Not Found').should('exist')
  })

  it('should show app loader while loading the collection', () => {
    const DELAYED_TIME = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => collection)
    })

    cy.mountAuthenticated(
      <EditCollectionFeaturedItems
        collectionIdFromParams="root"
        collectionRepository={collectionRepository}
      />
    )

    cy.clock()
    cy.findByTestId('app-loader').should('exist').should('be.visible')

    cy.tick(DELAYED_TIME)
    cy.findByTestId('app-loader').should('not.exist')
  })

  it('should show error alert when there is an error loading the collection featured items', () => {
    collectionRepository.getFeaturedItems = cy
      .stub()
      .rejects('Error loading collection featured items')

    cy.mountAuthenticated(
      <EditCollectionFeaturedItems
        collectionIdFromParams="root"
        collectionRepository={collectionRepository}
      />
    )

    cy.findByText('Error').should('exist')
  })

  it('renders the correct breadcrumbs', () => {
    cy.mountAuthenticated(
      <EditCollectionFeaturedItems
        collectionIdFromParams="root"
        collectionRepository={collectionRepository}
      />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Featured Items')
      .should('have.class', 'active')
  })
})
