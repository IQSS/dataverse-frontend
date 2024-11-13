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
  it('define collection query params correctly when all query params are in the url', () => {
    const searchParams = new URLSearchParams({})

    searchParams.set(QueryParamKey.QUERY, QUERY_VALUE)
    searchParams.set(
      QueryParamKey.COLLECTION_ITEM_TYPES,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET].join(',')
    )
    searchParams.set(QueryParamKey.PAGE, PAGE_NUMBER.toString())
    const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

    expect(collectionQueryParams.searchQuery).to.equal(DECODED_QUERY_VALUE)
    expect(collectionQueryParams.typesQuery).to.deep.equal([
      CollectionItemType.COLLECTION,
      CollectionItemType.DATASET
    ])
    expect(collectionQueryParams.pageQuery).to.equal(PAGE_NUMBER)
  })

  it('define collection query params correctly when only query param is in the url', () => {
    const searchParams = new URLSearchParams({})

    searchParams.set(QueryParamKey.QUERY, QUERY_VALUE)
    const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

    expect(collectionQueryParams.searchQuery).to.equal(DECODED_QUERY_VALUE)
    expect(collectionQueryParams.typesQuery).to.deep.equal(undefined)
    expect(collectionQueryParams.pageQuery).to.equal(1)
  })

  it('define collection query params correctly when only types query param is in the url', () => {
    const searchParams = new URLSearchParams({})

    searchParams.set(
      QueryParamKey.COLLECTION_ITEM_TYPES,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET].join(',')
    )
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
  })

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
})
