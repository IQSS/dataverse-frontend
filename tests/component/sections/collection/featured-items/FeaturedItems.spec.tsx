import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { FeaturedItems } from '@/sections/collection/featured-items/FeaturedItems'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

const collectionRepository = {} as CollectionRepository
const testCollectionId = 'root'

const featuredItemOne = CollectionFeaturedItemMother.createFeaturedItem({
  content: '<h1 class="rte-heading">Title One</h1>',
  imageFileUrl: undefined
})
const featuredItemTwo = CollectionFeaturedItemMother.createFeaturedItem({
  content: '<h1 class="rte-heading">Title Two</h1>',
  imageFileUrl: undefined
})

const testFeaturedItems = [featuredItemOne, featuredItemTwo]

describe('FeaturedItems', () => {
  beforeEach(() => {
    cy.viewport(1440, 1080)
  })

  it('renders the collection featured items carousel with the two items', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves(testFeaturedItems)

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items-slider').should('exist')

    cy.findByRole('button', { name: 'Featured Items' }).click()

    cy.findByText('Title One').should('exist').should('be.visible')

    cy.findByLabelText('Go to next slide').click()

    cy.findByText('Title Two').should('exist').should('be.visible')
  })

  it('does not render the collection featured items carousel when there are no items', () => {
    collectionRepository.getFeaturedItems = cy.stub().resolves([])

    cy.customMount(
      <FeaturedItems collectionRepository={collectionRepository} collectionId={testCollectionId} />
    )

    cy.findByTestId('featured-items-slider').should('not.exist')
  })
})
