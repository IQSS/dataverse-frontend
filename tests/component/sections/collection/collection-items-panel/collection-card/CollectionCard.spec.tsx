import { CollectionCard } from '@/sections/collection/collection-items-panel/items-list/collection-card/CollectionCard'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { CollectionItemTypePreviewMother } from '../../../../collection/domain/models/CollectionItemTypePreviewMother'

describe('CollectionCard', () => {
  it('should render the card', () => {
    const collectionPreview = CollectionItemTypePreviewMother.createRealistic()

    cy.customMount(
      <CollectionCard collectionPreview={collectionPreview} parentCollectionAlias="" />
    )

    cy.contains(DateHelper.toDisplayFormat(collectionPreview.releaseOrCreateDate)).should('exist')
    collectionPreview.description && cy.findByText(collectionPreview.description).should('exist')
    collectionPreview.parentCollectionName &&
      cy.findByText(collectionPreview.parentCollectionName).should('exist')
    collectionPreview.affiliation && cy.contains(collectionPreview.affiliation).should('exist')
    collectionPreview.name && cy.contains(collectionPreview.name).should('exist')
  })

  it('should render the card with a thumbnail', () => {
    const collectionPreview = CollectionItemTypePreviewMother.createWithThumbnail()

    cy.customMount(
      <CollectionCard collectionPreview={collectionPreview} parentCollectionAlias="" />
    )

    cy.findByAltText(collectionPreview.name).should('exist')
  })

  it('should render the card with user roles', () => {
    const userRoles = ['Admin', 'Contributor', 'Curator']
    const collectionPreview = CollectionItemTypePreviewMother.create({ userRoles: userRoles })

    cy.customMount(<CollectionCard collectionPreview={collectionPreview} />)

    userRoles.map((role) => {
      cy.findByText(role).should('exist')
    })
  })

  it('should render the linked icon when isLinked is true', () => {
    const collectionPreview = CollectionItemTypePreviewMother.createLinked()

    cy.customMount(
      <CollectionCard collectionPreview={collectionPreview} parentCollectionAlias="" />
    )

    cy.findByTestId('linked-collection-icon').should('exist')
  })

  it('should not overflow horizontally with long unspaced titles', () => {
    const longName = 'abc'.repeat(50)
    const collectionPreview = CollectionItemTypePreviewMother.create({
      name: longName
    })

    cy.customMount(
      <CollectionCard collectionPreview={collectionPreview} parentCollectionAlias="" />
    )

    cy.contains(longName).should('exist')
    // Ensure the title wraps within the available width (no horizontal overflow)
    cy.get('[data-testid="collection-card"] header a').then(($a) => {
      const el = $a[0]
      expect(el.scrollWidth).to.be.lte(el.clientWidth)
    })
  })
})
