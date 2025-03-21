import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { FeaturedItem } from '@/sections/featured-item/FeaturedItem'

const collectionRepository = {} as CollectionRepository
const testCollectionId = 'root'

const collection = CollectionMother.create({ name: 'Collection Name' })

const featuredItemOne = CollectionFeaturedItemMother.createCustomFeaturedItem('css', {
  content: '<h1 class="rte-heading">Title One</h1>'
})
const featuredItemTwo = CollectionFeaturedItemMother.createCustomFeaturedItem('books', {
  content: '<h1 class="rte-heading">Title Two</h1>'
})

describe('FeaturedItem', () => {
  beforeEach(() => {
    cy.viewport(1440, 900)
    collectionRepository.getById = cy.stub().resolves(collection)
    collectionRepository.getFeaturedItems = cy.stub().resolves([featuredItemOne, featuredItemTwo])
  })

  it('shows app loader while loading', () => {
    const DELAYED_TIME = 200
    collectionRepository.getById = cy.stub().callsFake(() => {
      return Cypress.Promise.delay(DELAYED_TIME).then(() => collection)
    })

    cy.customMount(
      <FeaturedItem
        collectionRepository={collectionRepository}
        parentCollectionIdFromParams={testCollectionId}
        featuredItemId={featuredItemOne.id.toString()}
      />
    )

    cy.clock()

    cy.findByTestId('app-loader').should('exist')

    cy.tick(DELAYED_TIME)

    cy.findByTestId('app-loader').should('not.exist')

    cy.clock().then((clock) => clock.restore())
  })

  it('renders correctly', () => {
    cy.customMount(
      <FeaturedItem
        collectionRepository={collectionRepository}
        parentCollectionIdFromParams={testCollectionId}
        featuredItemId={featuredItemOne.id.toString()}
      />
    )
    // Filters featured item by id
    cy.findByText('Title One').should('exist')
    cy.findByText('Title Two').should('not.exist')

    cy.findByRole('img').should('exist')
  })

  it('shows error alert when there is an error loading the featured item', () => {
    collectionRepository.getFeaturedItems = cy
      .stub()
      .rejects(new Error('An error occurred while loading the featured item'))

    cy.customMount(
      <FeaturedItem
        collectionRepository={collectionRepository}
        parentCollectionIdFromParams={testCollectionId}
        featuredItemId={featuredItemOne.id.toString()}
      />
    )

    cy.findByText(/An error occurred while loading the featured item./).should('exist')
  })
})
