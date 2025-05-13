import { SelectedFacets } from '@/sections/collection/collection-items-panel/selected-facets/SelectedFacets'

describe('SelectedFacets', () => {
  it('should render the correct selected facets', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        selectedFilterQueries={['Foo:Bar', 'Foo2:Bar 2']}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={false}
      />
    )
  })

  it('should call onRemoveFacet when clicking on a selected facet', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        selectedFilterQueries={['Foo:Bar', 'Foo:Doe']}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByRole('button', { name: /Bar/ }).click()

    cy.wrap(onRemoveFacet).should('be.calledWith', 'Foo:Bar')

    cy.findByRole('button', { name: /Doe/ }).click()

    cy.wrap(onRemoveFacet).should('be.calledWith', 'Foo:Doe')
  })

  it('should disable the button when loading collection items', () => {
    const onRemoveFacet = cy.stub().as('onRemoveFacet')

    cy.customMount(
      <SelectedFacets
        selectedFilterQueries={['Foo:Bar']}
        onRemoveFacet={onRemoveFacet}
        isLoadingCollectionItems={true}
      />
    )

    cy.findByRole('button', { name: /Bar/ }).should('be.disabled')
  })
})
