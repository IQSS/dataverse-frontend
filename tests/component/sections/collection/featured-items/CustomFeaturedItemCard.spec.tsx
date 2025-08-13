import { CustomFeaturedItemCard } from '@/sections/collection/featured-items/custom-featured-item-card/CustomFeaturedItemCard'
import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'

const featuredItemWithImage = FeaturedItemMother.createCustomFeaturedItem('css', {
  id: 1,
  content: 'hey'
})

const featuredItemWithoutImage = FeaturedItemMother.createCustomFeaturedItem('books', {
  id: 2,
  content: 'hey I am without image',
  imageFileUrl: undefined
})

describe('CustomFeaturedItemCard', () => {
  it('should render correctly', () => {
    cy.customMount(<CustomFeaturedItemCard collectionId="1" featuredItem={featuredItemWithImage} />)

    cy.findByTestId('custom-featured-item-card').should('exist')
    cy.get('a').should('have.attr', 'href', '/featured-item/1/1')
    cy.findByRole('img').should('exist')
    cy.findByText('hey').should('exist')
  })

  it('should render correctly without image', () => {
    cy.customMount(
      <CustomFeaturedItemCard collectionId="1" featuredItem={featuredItemWithoutImage} />
    )

    cy.findByTestId('custom-featured-item-card').should('exist')
    cy.get('a').should('have.attr', 'href', '/featured-item/1/2')
    cy.findByRole('img').should('not.exist')
    cy.findByText('hey I am without image').should('exist')
  })
})
