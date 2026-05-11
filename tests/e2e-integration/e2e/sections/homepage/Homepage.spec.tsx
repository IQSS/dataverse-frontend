import { FRONTEND_BASE_PATH } from '@tests/e2e-integration/shared/basePath'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { CollectionItemType } from '../../../../../src/collection/domain/models/CollectionItemType'

describe('Homepage', () => {
  it('should navigate to the collections page with the search value encoded in the URL', () => {
    const searchValue = 'John Doe'
    cy.visit(`${FRONTEND_BASE_PATH}/`)
    cy.get('[aria-label="Search"]').type(searchValue)
    cy.get('[aria-label="Submit Search"]').click()

    const searchParams = new URLSearchParams()
    searchParams.set(CollectionItemsQueryParams.QUERY, searchValue)
    searchParams.set(
      CollectionItemsQueryParams.TYPES,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE].join(',')
    )

    cy.url().should('include', `/collections?${searchParams.toString()}`)
  })

  it('navigates directly to the collection page when clicking the Browse All Collections button', () => {
    cy.visit(`${FRONTEND_BASE_PATH}/`)
    cy.findByRole('link', { name: 'Browse All Collections' }).click()

    cy.url().should('eq', `${Cypress.config().baseUrl as string}${FRONTEND_BASE_PATH}/collections`)
  })
})
