import { CollectionCard } from '@/sections/collection/collection-items-panel/items-list/collection-card/CollectionCard'
import { DateHelper } from '@/shared/helpers/DateHelper'
import { CollectionItemTypePreviewMother } from '../../../../collection/domain/models/CollectionItemTypePreviewMother'

describe('CollectionCard', () => {
  it('should render the card', () => {
    const collectionPreview = CollectionItemTypePreviewMother.createRealistic()

    cy.customMount(<CollectionCard collectionPreview={collectionPreview} />)

    cy.contains(DateHelper.toDisplayFormat(collectionPreview.releaseOrCreateDate)).should('exist')
    collectionPreview.description && cy.findByText(collectionPreview.description).should('exist')
    collectionPreview.parentCollectionName &&
      cy.findByText(collectionPreview.parentCollectionName).should('exist')
    collectionPreview.affiliation && cy.contains(collectionPreview.affiliation).should('exist')
    collectionPreview.name && cy.contains(collectionPreview.name).should('exist')
  })

  it('should render the card with a thumbnail', () => {
    const collectionPreview = CollectionItemTypePreviewMother.createWithThumbnail()

    cy.customMount(<CollectionCard collectionPreview={collectionPreview} />)

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
})
