import { FeaturedItemMother } from '@tests/component/collection/domain/models/FeaturedItemMother'
import { CollectionMother } from '@tests/component/collection/domain/models/CollectionMother'
import { FeaturedItemView } from '@/sections/featured-item/featured-item-view/FeaturedItemView'

const collection = CollectionMother.create({ name: 'Collection Name' })

const featuredItemOne = FeaturedItemMother.createCustomFeaturedItem('css', {
  content: '<h1 class="rte-heading">Title One</h1>'
})
const featuredItemTwo = FeaturedItemMother.createCustomFeaturedItem('books', {
  content: '<h1 class="rte-heading">Title Two</h1>',
  imageFileUrl: undefined,
  imageFileName: undefined
})

describe('FeaturedItemView', () => {
  beforeEach(() => {
    cy.viewport(1440, 900)
  })

  it('shows image banner and content', () => {
    cy.customMount(
      <FeaturedItemView
        featuredItem={featuredItemOne}
        showBreadcrumbs={true}
        collectionHierarchy={collection.hierarchy}
      />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Featured Item')
      .should('have.class', 'active')

    cy.findByRole('img')
      .should('exist')
      .should('have.attr', 'src')
      .and('include', '/storybook/css.webp')
    cy.findByText('Title One').should('exist')
  })

  it('shows banner without breadcrumbs if showBreadcrumbs is false', () => {
    cy.customMount(<FeaturedItemView featuredItem={featuredItemOne} showBreadcrumbs={false} />)

    cy.findByRole('link', { name: 'Root' }).should('not.exist')

    cy.get('li[aria-current="page"]').should('not.exist')

    cy.findByRole('img').should('exist')
    cy.findByText('Title One').should('exist')
  })

  it('shows content without image banner', () => {
    cy.customMount(<FeaturedItemView featuredItem={featuredItemTwo} />)

    cy.findByRole('img').should('not.exist')
    cy.findByText('Title Two').should('exist')
  })

  it('shows content without image banner and breadcrumbs', () => {
    cy.customMount(
      <FeaturedItemView
        featuredItem={featuredItemTwo}
        showBreadcrumbs={true}
        collectionHierarchy={collection.hierarchy}
      />
    )

    cy.findByRole('link', { name: 'Root' }).should('exist')

    cy.get('li[aria-current="page"]')
      .should('exist')
      .should('have.text', 'Featured Item')
      .should('have.class', 'active')

    cy.findByRole('img').should('not.exist')
    cy.findByText('Title Two').should('exist')
  })

  it('shows img with blob url', () => {
    const featuredItem = FeaturedItemMother.createCustomFeaturedItem('css', {
      content: '<h1 class="rte-heading">Title One</h1>',
      imageFileUrl: 'blob:http://localhost:3000/1234'
    })

    cy.customMount(<FeaturedItemView featuredItem={featuredItem} />)

    cy.findByRole('img')
      .should('exist')
      .should('have.attr', 'src')
      .and('eq', 'blob:http://localhost:3000/1234')
  })

  it('sanitizes a script tag in content correctly', () => {
    const featuredItem = FeaturedItemMother.createCustomFeaturedItem('css', {
      content: '<h1>This content contained a script tag<script>alert("hello")</script></h1>'
    })

    cy.customMount(<FeaturedItemView featuredItem={featuredItem} />)

    cy.findByText('alert("hello")').should('not.exist')
    cy.findByText('This content contained a script tag').should('exist')
  })

  it('sanitizes an onclick attribute in content correctly', () => {
    const featuredItem = FeaturedItemMother.createCustomFeaturedItem('css', {
      content: '<h1 onclick="alert(\'hello\')">This content contained an onclick attribute</h1>'
    })

    cy.customMount(<FeaturedItemView featuredItem={featuredItem} />)

    cy.findByText('This content contained an onclick attribute').should('exist')
    cy.findByText('alert("hello")').should('not.exist')
  })
})
