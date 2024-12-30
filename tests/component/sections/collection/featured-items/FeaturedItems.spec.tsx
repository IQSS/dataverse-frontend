import { FeaturedItems } from '@/sections/collection/featured-items/FeaturedItems'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

const featuredItemOne = CollectionFeaturedItemMother.createFeaturedItem({
  content: '<h1 class="rte-heading">Title One</h1>',
  imageUrl: undefined
})
const featuredItemTwo = CollectionFeaturedItemMother.createFeaturedItem({
  content: '<h1 class="rte-heading">Title Two</h1>',
  imageUrl: undefined
})

const testFeaturedItems = [featuredItemOne, featuredItemTwo]

describe('FeaturedItems', () => {
  beforeEach(() => {
    cy.viewport(1440, 1080)
  })
  it('renders the collection featured items carousel with the two items', () => {
    cy.customMount(<FeaturedItems featuredItems={testFeaturedItems} />)

    cy.findByTestId('featured-items-slider').should('exist')

    cy.findByText('Title One').should('exist').should('be.visible')

    cy.findByLabelText('Go to next slide').click()

    cy.findByText('Title Two').should('exist').should('be.visible')
  })
})
