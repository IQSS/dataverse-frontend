import { ItemsSortBy } from '@/sections/collection/collection-items-panel/items-list/ItemsSortBy'
import { OrderType, SortType } from '@/collection/domain/models/CollectionSearchCriteria'

describe('ItemsSortBy', () => {
  it('should render Relevance option when search text is present', () => {
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
        currentSortOrder={OrderType.ASC}
        onSortChange={onSortChange}></ItemsSortBy>
    )
    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByRole('button', { name: /Name \(Z-A\)/ }).should('exist')
    cy.findByText(/Relevance/).should('not.exist')
    cy.findByRole('button', { name: /Name \(Z-A\)/ }).click({ force: true })
    cy.wrap(onSortChange).should('be.calledWith', 'name', 'desc')
  })
  it('should set sort type and order to undefined when Relevance is selected', () => {
    const onSortChange = cy.stub().as('onSortChange')

    cy.customMount(
      <ItemsSortBy
        isLoadingCollectionItems={false}
        currentSortType={SortType.NAME}
        currentSortOrder={OrderType.DESC}
        currentSearchText={'test'}
        onSortChange={onSortChange}></ItemsSortBy>
    )
    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByRole('button', { name: /Relevance/ }).should('exist')

    cy.findByText(/Relevance/).click()
    cy.wrap(onSortChange).should('be.calledWith', undefined, undefined)
  })
  it('should set sort type and order correctly  when Newest is selected', () => {
    const onSortChange = cy.stub().as('onSortChange')

    cy.customMount(
      <ItemsSortBy
        isLoadingCollectionItems={false}
        currentSortType={SortType.NAME}
        currentSortOrder={OrderType.DESC}
        onSortChange={onSortChange}></ItemsSortBy>
    )
    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByRole('button', { name: /Newest/ }).should('exist')
    cy.findByRole('button', { name: /Newest/ }).click({ force: true })

    cy.wrap(onSortChange).should('be.calledWith', 'date', 'desc')
  })
  it('should set sort type and order correctly  when Oldest is selected', () => {
    const onSortChange = cy.stub().as('onSortChange')

    cy.customMount(
      <ItemsSortBy
        isLoadingCollectionItems={false}
        currentSortType={SortType.NAME}
        currentSortOrder={OrderType.DESC}
        onSortChange={onSortChange}></ItemsSortBy>
    )
    cy.findByRole('button', { name: /Sort/ }).click()
    cy.findByRole('button', { name: /Oldest/ }).should('exist')
    cy.findByRole('button', { name: /Oldest/ }).click({ force: true })

    cy.wrap(onSortChange).should('be.calledWith', 'date', 'asc')
  })
  it('should set sort type and order correctly  when Name_ASC is selected', () => {
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
    cy.findByRole('button', { name: /Name \(A-Z\)/ }).click({ force: true })

    cy.wrap(onSortChange).should('be.calledWith', 'name', 'asc')
  })
})
