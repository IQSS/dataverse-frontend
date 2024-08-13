import { DateHelper } from '../../../../../../src/shared/helpers/DateHelper'
import { CollectionPreviewMother } from '../../../../collection/domain/models/CollectionPreviewMother'
import { CollectionCard } from '../../../../../../src/sections/collection/datasets-list/collection-card/CollectionCard'

describe('CollectionCard', () => {
  it('should render the card', () => {
    const collectionPreview = CollectionPreviewMother.createRealistic()

    cy.customMount(<CollectionCard collectionPreview={collectionPreview} />)

    cy.contains(DateHelper.toDisplayFormat(collectionPreview.releaseOrCreateDate)).should('exist')
    collectionPreview.description && cy.findByText(collectionPreview.description).should('exist')
    collectionPreview.parentCollectionName &&
      cy.findByText(collectionPreview.parentCollectionName).should('exist')
    collectionPreview.affiliation && cy.contains(collectionPreview.affiliation).should('exist')
    collectionPreview.name && cy.contains(collectionPreview.name).should('exist')
  })
})
