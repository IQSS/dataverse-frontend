import { CollectionItem } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { GetCollectionItemsQueryParams } from '@/collection/domain/models/GetCollectionItemsQueryParams'
import { QueryParamKey } from '@/sections/Route.enum'
import { DatasetHelper } from '@tests/e2e-integration/shared/datasets/DatasetHelper'
import { FileHelper } from '@tests/e2e-integration/shared/files/FileHelper'
import { TestsUtils } from '@tests/e2e-integration/shared/TestsUtils'
import { Interception } from 'cypress/types/net-stubbing'

const numbersOfDatasetsToCreate = [1, 2, 3, 4, 5, 6, 7, 8]

const SEARCH_ENDPOINT_REGEX = /^\/api\/v1\/search(\?.*)?$/

function extractInfoFromInterceptedResponse(interception: Interception) {
  const totalCount = interception?.response?.body?.data.total_count as number
  const totalItemsInResponse = interception?.response?.body?.data.items.length as number
  const collectionsInResponse = (
    interception?.response?.body?.data.items as CollectionItem[]
  ).filter((item: CollectionItem) => item.type === CollectionItemType.COLLECTION)
  const datasetsInResponse = (interception?.response?.body?.data.items as CollectionItem[]).filter(
    (item: CollectionItem) => item.type === CollectionItemType.DATASET
  )
  const filesInResponse = (interception?.response?.body?.data.items as CollectionItem[]).filter(
    (item: CollectionItem) => item.type === CollectionItemType.FILE
  )

  return {
    totalCount,
    totalItemsInResponse,
    collectionsInResponse,
    datasetsInResponse,
    filesInResponse
  }
}

describe('Collection Items Panel', () => {
  before(() => {
    TestsUtils.setup()
    TestsUtils.login()
  })

  beforeEach(async () => {
    cy.viewport(1280, 720)

    cy.intercept(SEARCH_ENDPOINT_REGEX).as('getCollectionItems')

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

  it('performs different search, filtering and respond to back and forward navigation', () => {
    cy.visit(`/spa/collections`)

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)
    })

    // 1 - Now select the Files checkbox
    cy.findByRole('checkbox', { name: /Files/ }).click()

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)

      const firstExpectedURL = new URLSearchParams({
        [GetCollectionItemsQueryParams.TYPES]: [
          CollectionItemType.COLLECTION,
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ].join(',')
      }).toString()

      cy.url().should('include', `/collections?${firstExpectedURL}`)
    })

    // 2 - Now perform a search in the input
    cy.findByPlaceholderText('Search this collection...').type('Darwin{enter}', { force: true })

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)

      const secondExpectedURL = new URLSearchParams({
        [GetCollectionItemsQueryParams.TYPES]: [
          CollectionItemType.COLLECTION,
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ].join(','),
        [QueryParamKey.QUERY]: 'Darwin'
      }).toString()

      cy.url().should('include', `/collections?${secondExpectedURL}`)
    })

    // 3 - Clear the search and assert that the search is performed correctly and the url is updated correctly
    cy.findByPlaceholderText('Search this collection...').clear()
    cy.findByRole('button', { name: /Search submit/ }).click({ force: true })

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)

      const thirdExpectedURL = new URLSearchParams({
        [GetCollectionItemsQueryParams.TYPES]: [
          CollectionItemType.COLLECTION,
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ].join(',')
      }).toString()

      cy.url().should('include', `/collections?${thirdExpectedURL}`)
    })

    // 4 - Uncheck the Collections checkbox

    cy.findByRole('checkbox', { name: /Collections/ }).click({ force: true })

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)

      const fourthExpectedURL = new URLSearchParams({
        [GetCollectionItemsQueryParams.TYPES]: [
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ].join(',')
      }).toString()

      cy.url().should('include', `/collections?${fourthExpectedURL}`)
    })

    // 5 - Uncheck the Dataset checkbox
    cy.findByRole('checkbox', { name: /Datasets/ }).click({ force: true })

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)

      const fifthExpectedURL = new URLSearchParams({
        [GetCollectionItemsQueryParams.TYPES]: [CollectionItemType.FILE].join(',')
      }).toString()

      cy.url().should('include', `/collections?${fifthExpectedURL}`)
    })

    // 6 - Navigate back with the browser and assert that the url is updated correctly and the items are displayed correctly as in step 4
    cy.go('back')

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)

      const fourthExpectedURL = new URLSearchParams({
        [GetCollectionItemsQueryParams.TYPES]: [
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ].join(',')
      }).toString()

      cy.url().should('include', `/collections?${fourthExpectedURL}`)
    })

    // 7 - Selects a facet filter
    cy.findByRole('button', { name: /Finch, Fiona/ }).click()

    cy.wait('@getCollectionItems').then((interception) => {
      const { totalItemsInResponse, collectionsInResponse, datasetsInResponse, filesInResponse } =
        extractInfoFromInterceptedResponse(interception)

      cy.findByTestId('items-list')
        .should('exist')
        .children()
        .should('have.length', totalItemsInResponse)

      collectionsInResponse.length > 0 &&
        cy.findAllByTestId('collection-card').should('have.length', collectionsInResponse.length)

      datasetsInResponse.length > 0 &&
        cy.findAllByTestId('dataset-card').should('have.length', datasetsInResponse.length)

      filesInResponse.length > 0 &&
        cy.findAllByTestId('file-card').should('have.length', filesInResponse.length)

      const expectedURL = new URLSearchParams({
        [GetCollectionItemsQueryParams.TYPES]: [
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ].join(','),
        [GetCollectionItemsQueryParams.FILTER_QUERIES]: [
          `authorName_ss:${encodeURIComponent('Finch, Fiona')}`
        ].join(',')
      }).toString()

      console.log({ expectedURL })

      cy.url().should('include', `/collections?${expectedURL}`)

      // Assert that the selected facet filter is displayed
      cy.findAllByRole('button', { name: /Finch, Fiona/ })
        .should('exist')
        .should('have.length', 2)
    })
  })
})
