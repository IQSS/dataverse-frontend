import { DvObjectFeaturedItemCard } from '@/sections/collection/featured-items/dv-object-featured-item-card/DvObjectFeaturedItemCard'
import { QueryParamKey, Route } from '@/sections/Route.enum'
import { CollectionFeaturedItemMother } from '@tests/component/collection/domain/models/CollectionFeaturedItemMother'

describe('DvObjectFeaturedItemCard', () => {
  it('should render correctly a featured item card type collection', () => {
    const featuredItemTypeCollection =
      CollectionFeaturedItemMother.createDvObjectCollectionFeaturedItem({
        dvObjectDisplayName: 'Collection Test'
      })
    cy.customMount(<DvObjectFeaturedItemCard featuredItem={featuredItemTypeCollection} />)

    cy.findByText('Collection Test').should('exist')
    cy.findByTestId('collection-icon').should('exist')
    cy.get('a').should(
      'have.attr',
      'href',
      `${Route.COLLECTIONS_BASE}/${featuredItemTypeCollection.dvObjectIdentifier}`
    )
  })

  it('should render correctly a featured item card type dataset', () => {
    const featuredItemTypeDataset = CollectionFeaturedItemMother.createDvObjectDatasetFeaturedItem({
      dvObjectDisplayName: 'Dataset Test'
    })

    cy.customMount(<DvObjectFeaturedItemCard featuredItem={featuredItemTypeDataset} />)

    cy.findByText('Dataset Test').should('exist')
    cy.findByTestId('dataset-icon').should('exist')
    cy.get('a').should(
      'have.attr',
      'href',
      `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${featuredItemTypeDataset.dvObjectIdentifier}`
    )
  })

  it('should render correctly a featured item card type file', () => {
    const featuredItemTypeFile = CollectionFeaturedItemMother.createDvObjectFileFeaturedItem({
      dvObjectDisplayName: 'File Test'
    })

    cy.customMount(<DvObjectFeaturedItemCard featuredItem={featuredItemTypeFile} />)

    cy.findByText('File Test').should('exist')
    cy.findByTestId('file-icon').should('exist')
    cy.get('a').should(
      'have.attr',
      'href',
      `${Route.FILES}?${QueryParamKey.FILE_ID}=${featuredItemTypeFile.dvObjectIdentifier}`
    )
  })

  // Should never happen, but if does, we render an empty link.
  it('should render link with # when type is unknown', () => {
    const featuredItemTypeFile = CollectionFeaturedItemMother.createDvObjectFileFeaturedItem({
      dvObjectDisplayName: 'File Test',
      type: undefined
    })

    cy.customMount(<DvObjectFeaturedItemCard featuredItem={featuredItemTypeFile} />)

    cy.findByText('File Test').should('exist')
    cy.get('a').should('have.attr', 'href', '/')
  })
})
