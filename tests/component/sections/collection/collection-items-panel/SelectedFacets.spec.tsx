import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { SelectedFacets } from '@/sections/collection/collection-items-panel/selected-facets/SelectedFacets'

const mockFacets: CollectionItemsFacet[] = [
  {
    name: 'publicationDate',
    friendlyName: 'Publication Year',
    labels: [{ name: '2024', count: 10 }]
  },
  {
    name: 'authorName',
    friendlyName: 'Author',
    labels: [{ name: 'Doe', count: 5 }]
  }
]

describe('SelectedFacets', () => {
  it('should render facet name and value correctly when matching facet exists', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        facets={mockFacets}
        selectedFilterQueries={['publicationDate:2024']}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByRole('button', { name: /Publication Year: 2024/ }).should('exist')
  })

  it('should fallback to filterQueryKey when no matching facet is found in facets prop', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        selectedFilterQueries={['Foo:Bar', 'Foo2:Bar 2']}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByRole('button', { name: /Foo: Bar/ }).should('exist')
    cy.findByRole('button', { name: /Foo2: Bar 2/ }).should('exist')
  })

  it('should call onRemoveFacet when clicking on a selected facet', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        facets={mockFacets}
        selectedFilterQueries={['publicationDate:2024', 'authorName:Doe']}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByRole('button', { name: /Publication Year: 2024/ }).click()

    cy.wrap(onRemoveFacet).should('be.calledWith', 'publicationDate:2024')

    cy.findByRole('button', { name: /Author: Doe/ }).click()

    cy.wrap(onRemoveFacet).should('be.calledWith', 'authorName:Doe')
  })

  it('should disable the button when loading collection items', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        facets={mockFacets}
        selectedFilterQueries={['publicationDate:2024']}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={true}
      />
    )

    cy.findByRole('button', { name: /Publication Year: 2024/ }).should('be.disabled')
  })

  it('should render "Unknown" when filter query split fails', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        selectedFilterQueries={['InvalidQuery'] as unknown as FilterQuery[]}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByRole('button', { name: /Unknown/ }).should('exist')
  })
})
