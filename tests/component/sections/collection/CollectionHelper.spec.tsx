import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { CollectionHelper } from '@/sections/collection/CollectionHelper'
import { QueryParamKey } from '@/sections/Route.enum'
import { CollectionItemType } from '@iqss/dataverse-client-javascript'

const QUERY_VALUE = 'John%20Doe'
const DECODED_QUERY_VALUE = 'John Doe'
const PAGE_NUMBER = 1

describe('CollectionHelper', () => {
  it('define collection query params correctly when all query params are in the url', () => {
    const searchParams = new URLSearchParams({
      [QueryParamKey.QUERY]: QUERY_VALUE,
      [CollectionItemsQueryParams.TYPES]: [
        CollectionItemType.COLLECTION,
        CollectionItemType.DATASET
      ].join(','),
      [QueryParamKey.PAGE]: PAGE_NUMBER.toString(),
      [CollectionItemsQueryParams.FILTER_QUERIES]: [
        'someFilter:someValue',
        'otherFilter:otherValue'
      ].join(',')
    })

    const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

    expect(collectionQueryParams.searchQuery).to.equal(DECODED_QUERY_VALUE)
    expect(collectionQueryParams.typesQuery).to.deep.equal([
      CollectionItemType.COLLECTION,
      CollectionItemType.DATASET
    ])
    expect(collectionQueryParams.pageQuery).to.equal(PAGE_NUMBER)
    expect(collectionQueryParams.filtersQuery).to.deep.equal([
      'someFilter:someValue',
      'otherFilter:otherValue'
    ])
  })

  it('define collection query params correctly when only query param is in the url', () => {
    const searchParams = new URLSearchParams({
      [QueryParamKey.QUERY]: QUERY_VALUE
    })

    const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

    expect(collectionQueryParams.searchQuery).to.equal(DECODED_QUERY_VALUE)
    expect(collectionQueryParams.typesQuery).to.deep.equal(undefined)
    expect(collectionQueryParams.pageQuery).to.equal(1)
    expect(collectionQueryParams.filtersQuery).to.equal(undefined)
  })

  it('define collection query params correctly when only types query param is in the url', () => {
    const searchParams = new URLSearchParams({
      [CollectionItemsQueryParams.TYPES]: [
        CollectionItemType.COLLECTION,
        CollectionItemType.DATASET
      ].join(',')
    })

    const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

    expect(collectionQueryParams.searchQuery).to.equal(undefined)
    expect(collectionQueryParams.typesQuery).to.deep.equal([
      CollectionItemType.COLLECTION,
      CollectionItemType.DATASET
    ])
    expect(collectionQueryParams.pageQuery).to.equal(1)
  })

  it('define collection query params correctly when there are no query params in the url', () => {
    const searchParams = new URLSearchParams({})
    const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

    expect(collectionQueryParams.searchQuery).to.equal(undefined)
    expect(collectionQueryParams.typesQuery).to.deep.equal(undefined)
    expect(collectionQueryParams.pageQuery).to.equal(1)
    expect(collectionQueryParams.filtersQuery).to.equal(undefined)
  })
})
