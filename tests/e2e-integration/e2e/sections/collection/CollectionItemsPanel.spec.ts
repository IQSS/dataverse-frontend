import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { QueryParamKey } from '@/sections/Route.enum'
import { DatasetHelper } from '@tests/e2e-integration/shared/datasets/DatasetHelper'
import { FileHelper } from '@tests/e2e-integration/shared/files/FileHelper'
import { TestsUtils } from '@tests/e2e-integration/shared/TestsUtils'

const numbersOfDatasetsToCreate = [1, 2, 3, 4, 5, 6, 7, 8]

describe('Collection Items Panel', () => {
  before(() => {
    TestsUtils.setup()
    TestsUtils.login()
  })

  beforeEach(async () => {
    // Creates 8 datasets with 1 file each
    for (const _number of numbersOfDatasetsToCreate) {
      await DatasetHelper.createWithFile(FileHelper.create())
    }
  })

  afterEach(() => {
    DatasetHelper.destroyAllDatasets().catch((error) => {
      console.error('Error destroying datasets:', error)
    })
  })

  //TODO: I cant call CollectionHelper with a destroy method because it gives me an error, so only testing dataset and filter items

  it.only('performs different search, filtering and respond to back and forward navigation', () => {
    cy.visit(`/spa/collections`)

    cy.wait(4_000)

    // Should show 8 items:  8 Datasets only because by default if no query params are present in the URL, the item types by default are COLLECTION and DATASET.
    cy.findByTestId('items-list').should('exist').children().should('have.length', 8)
    cy.findByText('8 results').should('exist')

    // 1 - Now select checkbox file, assert that 10 of 16 results displayed and url is updated correctly
    cy.findByRole('checkbox', { name: /Files/ }).click()

    const firstExpectedURL = new URLSearchParams({
      [QueryParamKey.COLLECTION_ITEM_TYPES]: [
        CollectionItemType.COLLECTION,
        CollectionItemType.DATASET,
        CollectionItemType.FILE
      ].join(',')
    }).toString()

    cy.url().should('include', `/collections?${firstExpectedURL}`)

    cy.findByText('10 of 16 results displayed').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)

    // 2 - Now perform a search in the input and validate that the search is performed correctly and the url is updated correctly
    cy.findByPlaceholderText('Search this collection...').type('Darwin{enter}')

    const secondExpectedURL = new URLSearchParams({
      [QueryParamKey.COLLECTION_ITEM_TYPES]: [
        CollectionItemType.COLLECTION,
        CollectionItemType.DATASET,
        CollectionItemType.FILE
      ].join(','),
      [QueryParamKey.QUERY]: 'Darwin'
    }).toString()

    cy.url().should('include', `/collections?${secondExpectedURL}`)

    cy.findByText('8 results').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 8)

    // 3 - Clear the search and assert that the search is performed correctly and the url is updated correctly
    cy.findByPlaceholderText('Search this collection...').clear()
    cy.findByRole('button', { name: /Search submit/ }).click()

    const thirdExpectedURL = new URLSearchParams({
      [QueryParamKey.COLLECTION_ITEM_TYPES]: [
        CollectionItemType.COLLECTION,
        CollectionItemType.DATASET,
        CollectionItemType.FILE
      ].join(',')
    }).toString()

    cy.url().should('include', `/collections?${thirdExpectedURL}`)

    cy.findByText('10 of 16 results displayed').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)

    // 4 - Uncheck all and check only Files, assert that  8 results displayed and url is updated correctly

    cy.findByRole('checkbox', { name: /Collections/ }).click()
    cy.findByRole('checkbox', { name: /Datasets/ }).click()

    const fourthExpectedURL = new URLSearchParams({
      [QueryParamKey.COLLECTION_ITEM_TYPES]: [CollectionItemType.FILE].join(',')
    }).toString()

    cy.url().should('include', `/collections?${fourthExpectedURL}`)
    cy.findByText('8 results').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 8)

    // 5 - Now check all to get 16 total items by scroll to the bottom and assert that 16 of 16 results displayed
    cy.findByRole('checkbox', { name: /Collections/ }).click()
    cy.findByRole('checkbox', { name: /Datasets/ }).click()

    cy.findByText('10 of 16 results displayed').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 10)

    cy.findByTestId('items-list-scrollable-container').scrollTo('bottom')

    const fifthExpectedURL = new URLSearchParams({
      [QueryParamKey.COLLECTION_ITEM_TYPES]: [
        CollectionItemType.FILE,
        CollectionItemType.COLLECTION,
        CollectionItemType.DATASET
      ].join(',')
    }).toString()

    cy.url().should('include', `/collections?${fifthExpectedURL}`)

    cy.findByText('16 of 16 results displayed').should('exist')

    cy.findByTestId('items-list').should('exist').children().should('have.length', 16)

    // 6 - Navigate baack with the browser and assert that the url is updated correctly and the items are displayed correctly as in step 4
    cy.go('back')

    cy.url().should('include', `/collections?${fourthExpectedURL}`)
    cy.findByText('8 results').should('exist')
    cy.findByTestId('items-list').should('exist').children().should('have.length', 8)
  })
})
