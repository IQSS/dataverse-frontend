import { QueryParamKey } from '../../../../../src/sections/Route.enum'

describe('Homepage', () => {
  it('should navigate to the collections page with the search value encoded in the URL', () => {
    const searchValue = 'John Doe'
    cy.visit('/spa/')
    cy.get('[aria-label="Search"]').type(searchValue)
    cy.get('[aria-label="Submit Search"]').click()

    const encodedSearchValue = encodeURIComponent(searchValue)

    const searchParams = new URLSearchParams()
    searchParams.set(QueryParamKey.QUERY, encodedSearchValue)

    cy.url().should('include', `/collections?${searchParams.toString()}`)
  })

  it('navigates directly to the collection page when clicking the Browse Collections button', () => {
    cy.visit('/spa/')
    cy.findByRole('link', { name: 'Browse Collections' }).click()

    cy.url().should('eq', `${Cypress.config().baseUrl as string}/spa/collections`)
  })
})
