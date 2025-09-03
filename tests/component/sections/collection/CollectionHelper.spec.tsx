import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { CollectionHelper } from '@/sections/collection/CollectionHelper'
import { QueryParamKey } from '@/sections/Route.enum'
import {
  DvObjectType,
  UpwardHierarchyNode
} from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'

const QUERY_VALUE = 'John%20Doe'
const DECODED_QUERY_VALUE = 'John Doe'
const PAGE_NUMBER = 1

describe('CollectionHelper', () => {
  describe('isRootCollection', () => {
    it('returns true when collection is root collection', () => {
      const collectionHierarchy: UpwardHierarchyNode = new UpwardHierarchyNode(
        'Root',
        DvObjectType.COLLECTION,
        'root'
      )
      expect(CollectionHelper.isRootCollection(collectionHierarchy)).to.be.true
    })

    it('returns false when collection is not root collection', () => {
      const collectionHierarchy: UpwardHierarchyNode = new UpwardHierarchyNode(
        'Subcollection',
        DvObjectType.COLLECTION,
        'subcollection',
        undefined,
        undefined,
        undefined,
        new UpwardHierarchyNode('Root', DvObjectType.COLLECTION, 'root')
      )
      expect(CollectionHelper.isRootCollection(collectionHierarchy)).to.be.false
    })
  })

  describe('getParentCollection', () => {
    it('returns parent collection when collection has parent', () => {
      const parentCollection: UpwardHierarchyNode = new UpwardHierarchyNode(
        'Root',
        DvObjectType.COLLECTION,
        'root'
      )
      const collectionHierarchy: UpwardHierarchyNode = new UpwardHierarchyNode(
        'Subcollection',
        DvObjectType.COLLECTION,
        'subcollection',
        undefined,
        undefined,
        undefined,
        parentCollection
      )
      expect(CollectionHelper.getParentCollection(collectionHierarchy)).to.deep.equal(
        parentCollection
      )
    })

    it('returns undefined when collection does not have parent', () => {
      const collectionHierarchy: UpwardHierarchyNode = new UpwardHierarchyNode(
        'Root',
        DvObjectType.COLLECTION,
        'root'
      )
      expect(CollectionHelper.getParentCollection(collectionHierarchy)).to.be.undefined
    })
  })

  describe('defineCollectionQueryParams', () => {
    it('define collection query params correctly when all query params are in the url', () => {
      const searchParams = new URLSearchParams({
        [CollectionItemsQueryParams.QUERY]: QUERY_VALUE,
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
        [CollectionItemsQueryParams.QUERY]: QUERY_VALUE
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

    it('defines collection query params correctly when filter queries values contain colons', () => {
      const searchParams = new URLSearchParams({
        [CollectionItemsQueryParams.FILTER_QUERIES]:
          'someFilter:some:Value,otherFilter:other: Value'
      })
      const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)
      expect(collectionQueryParams.filtersQuery).to.deep.equal([
        'someFilter:some:Value',
        'otherFilter:other: Value'
      ])
    })

    it('defines collection query params correctly when filter queries have bad encoding', () => {
      const searchParams = new URLSearchParams({
        [CollectionItemsQueryParams.FILTER_QUERIES]: 'someFilter:%E0%A4%A'
      })
      const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)
      expect(collectionQueryParams.filtersQuery).to.deep.equal(['someFilter:%E0%A4%A'])
    })

    it('returns null when splitting a filter query that does not contain a colon', () => {
      const searchParams = new URLSearchParams({
        [CollectionItemsQueryParams.FILTER_QUERIES]: 'invalidFilterQuery'
      })
      const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)
      expect(collectionQueryParams.filtersQuery).to.deep.equal([])
    })
  })

  describe('splitFilterQueryKeyAndValue', () => {
    it('returns null when filter query does not contain a colon', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue('invalidFilterQuery')
      expect(result).to.be.null
    })

    it('returns null when filter query has empty key', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue(':value')
      expect(result).to.be.null
    })

    it('returns null when filter query has empty value', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue('key:')
      expect(result).to.be.null
    })

    it('returns null when filter query has whitespace key', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue('   :value')
      expect(result).to.be.null
    })

    it('returns null when filter query has whitespace value', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue('key:    ')
      expect(result).to.be.null
    })

    it('returns the correct key and value when filter query value contains a colon', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue('is:valid:value')
      expect(result).to.deep.equal({ filterQueryKey: 'is', filterQueryValue: 'valid:value' })
    })

    it('returns the correct key and value when filter query is valid', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue('key:value')
      expect(result).to.deep.equal({ filterQueryKey: 'key', filterQueryValue: 'value' })
    })

    it('trims whitespace from key and value', () => {
      const result = CollectionHelper.splitFilterQueryKeyAndValue('  key  :  value  ')
      expect(result).to.deep.equal({ filterQueryKey: 'key', filterQueryValue: 'value' })
    })
  })
})
