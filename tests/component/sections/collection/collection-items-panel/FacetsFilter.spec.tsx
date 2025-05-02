import { FacetsFilters } from '@/sections/shared/collection-items-panel/filter-panel/facets-filters/FacetsFilters'
import { CollectionItemsMother } from '@tests/component/collection/domain/models/CollectionItemsMother'
import styles from '@/sections/shared/collection-items-panel/filter-panel/facets-filters/FacetsFilters.module.scss'

const facets = CollectionItemsMother.createItemsFacets()

describe('FacetsFilters', () => {
  it('should render skeleton while loading collection items and no facets', () => {
    cy.customMount(
      <FacetsFilters facets={[]} onFacetChange={cy.stub()} isLoadingCollectionItems={true} />
    )

    cy.findByTestId('facets-filters-skeleton').should('exist')
  })

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

  it('show more and less functionality', () => {
    const onFacetChange = cy.stub().as('onFacetChange')

    cy.customMount(
      <FacetsFilters
        facets={facets}
        onFacetChange={onFacetChange}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByRole('button', { name: /More.../ }).should('exist')

    // This will be the sixth label, we are only showing 5 by default
    cy.findByRole('button', { name: /Foo/ }).should('not.exist')

    cy.findByRole('button', { name: /More.../ }).click()

    cy.findByRole('button', { name: /Foo/ }).should('exist')

    cy.findByRole('button', { name: /More.../ }).should('not.exist')
    cy.findByRole('button', { name: /Less.../ }).should('exist')

    cy.findByRole('button', { name: /Less.../ }).click()

    cy.findByRole('button', { name: /Foo/ }).should('not.exist')
  })
})
