import { FacetsFilters } from '@/sections/collection/collection-items-panel/filter-panel/facets-filters/FacetsFilters'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'
import styles from '@/sections/collection/collection-items-panel/filter-panel/facets-filters/FacetsFilters.module.scss'

const facets = CollectionItemsMother.createItemsFacets()

describe('FacetsFilters', () => {
  it('should render selected facets with selected classname', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
        currentFilterQueries={['dvCategory:Department', 'authorName_ss:Admin, Dataverse']}
      />
    )

    cy.findByRole('button', { name: /Department/ })
      .should('exist')
      .should('have.class', styles.selected)

    cy.findByRole('button', { name: /Journal/ })
      .should('exist')
      .should('not.have.class', styles.selected)
  })

  it('should call onFacetChange when clicking on a not selected facet filter with the correct args', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
        currentFilterQueries={['dvCategory:Department', 'authorName_ss:Admin, Dataverse']}
      />
    )

    cy.findByRole('button', { name: /Journal/ }).click()

    cy.wrap(onFacetChange).should('be.calledWith', 'dvCategory:Journal', 'add')

    // TODO:ME - Check correct aria labels if selected or not, test the show more or less buttons
  })

  it('should call onFacetChange when clicking on an alreadt selected facet filter with the correct args', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
        currentFilterQueries={['dvCategory:Department', 'authorName_ss:Admin, Dataverse']}
      />
    )

    cy.findByRole('button', { name: /Department/ }).click()

    cy.wrap(onFacetChange).should('be.calledWith', 'dvCategory:Department', 'remove')
  })
})
