import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { FilterPanel } from '@/sections/collection/collection-items-panel/filter-panel/FilterPanel'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'

const facets = CollectionItemsMother.createItemsFacets()

describe('FilterPanel', () => {
  it('should open and close correctly the off canvas in mobile view', () => {
    cy.viewport(375, 700)

    const onItemTypesChange = cy.stub().as('onItemTypesChange')
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FilterPanel
        onItemTypesChange={onItemTypesChange}
        isLoadingCollectionItems={true}
        currentItemTypes={[CollectionItemType.COLLECTION, CollectionItemType.DATASET]}
        facets={facets}
        onFacetChange={onFacetChange}
      />
    )

    cy.findByRole('button', { name: /Filter Results/ }).click()

    cy.findByTestId('filter-panel-off-canvas-body').should('not.be.visible')

    cy.findByTestId('filter-panel-off-canvas-body').should('be.visible')

    cy.findByLabelText(/Close/).click()

    cy.findByTestId('filter-panel-off-canvas-body').should('not.be.visible')
  })
})
