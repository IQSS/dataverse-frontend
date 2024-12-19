import { ItemsSortBy } from '@/sections/collection/collection-items-panel/items-list/ItemsSortBy'
import { OrderType, SortType } from '@/collection/domain/models/CollectionSearchCriteria'

describe('ItemsSortBy', () => {
  it.only('should render Relevance option when search text is present', () => {
    const onSortChange = cy.stub().as('onSortChange')

    cy.customMount(
      <ItemsSortBy
        currentSortType={undefined}
        currentSortOrder={undefined}
        currentSearchText={'searchText'}
        isLoadingCollectionItems={false}
        onSortChange={onSortChange}></ItemsSortBy>
    )
    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByRole('button', { name: /Relevance/ }).should('exist')
  })

  it('should not render Relevance option when search text is undefined', () => {
    const onSortChange = cy.stub().as('onSortChange')

    cy.customMount(
      <ItemsSortBy
        isLoadingCollectionItems={false}
        currentSortType={SortType.NAME}
        currentSortOrder={OrderType.DESC}
        onSortChange={onSortChange}></ItemsSortBy>
    )
    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByRole('button', { name: /Name \(A-Z\)/ }).should('exist')
    cy.findByText(/Relevance/).should('not.exist')

    cy.findByText(/Name \(A-Z\)/).click()
    cy.wrap(onSortChange).should('be.calledWith', 'name', 'asc')
  })
})
