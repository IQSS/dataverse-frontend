import { SearchPanel } from '@/sections/collection/collection-items-panel/search-panel/SearchPanel'

describe('SearchPanel', () => {
  it('prefills the search input with the search query param', () => {
    const onSubmitSearch = cy.stub().as('onSubmitSearch')

    const SEARCH_VALUE = 'some search'
    cy.customMount(
      <SearchPanel
        placeholderText={'Search this collection...'}
        onSubmitSearch={onSubmitSearch}
        isLoadingCollectionItems={false}
        currentSearchValue={SEARCH_VALUE}
      />
    )

    cy.findByPlaceholderText('Search this collection...').should('have.value', SEARCH_VALUE)
  })

  it('search submit button is disabled while loading items', () => {
    const onSubmitSearch = cy.stub().as('onSubmitSearch')
    cy.customMount(
      <SearchPanel
        placeholderText={'Search this collection...'}
        onSubmitSearch={onSubmitSearch}
        isLoadingCollectionItems={true}
      />
    )

    cy.findByLabelText(/Search submit/)
      .should('exist')
      .should('be.disabled')
  })

  it('updates the search value while typing something', () => {
    const onSubmitSearch = cy.stub().as('onSubmitSearch')
    cy.customMount(
      <SearchPanel
        placeholderText={'Search this collection...'}
        onSubmitSearch={onSubmitSearch}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByPlaceholderText('Search this collection...').type('John Doe')

    cy.findByPlaceholderText('Search this collection...').should('have.value', 'John Doe')
  })

  it('submits the search value whit the correct argument', () => {
    const onSubmitSearch = cy.stub().as('onSubmitSearch')
    const SEARCH_VALUE = 'John Doe'
    const expectedCallWithValue = encodeURIComponent(SEARCH_VALUE)

    cy.customMount(
      <SearchPanel
        placeholderText={'Search this collection...'}
        onSubmitSearch={onSubmitSearch}
        isLoadingCollectionItems={false}
      />
    )

    cy.findByPlaceholderText('Search this collection...').type(SEARCH_VALUE)
    cy.findByRole('button', { name: /Search submit/ }).click()

    cy.wrap(onSubmitSearch).should('have.been.calledWith', expectedCallWithValue)
  })
})
