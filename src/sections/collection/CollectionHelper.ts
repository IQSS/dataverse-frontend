import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import {
  FilterQuery,
  OrderType,
  SortType
} from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { Collection } from '@/collection/domain/models/Collection'
import { UpwardHierarchyNode } from '@/shared/hierarchy/domain/models/UpwardHierarchyNode'

export class CollectionHelper {
  static defineCollectionQueryParams(searchParams: URLSearchParams) {
    const pageQuery = searchParams.get('page')
      ? parseInt(searchParams.get('page') as string, 10)
      : 1

    const searchQuery = searchParams.get(CollectionItemsQueryParams.QUERY)
      ? decodeURIComponent(searchParams.get(CollectionItemsQueryParams.QUERY) as string)
      : undefined

    const typesParam = searchParams.get(CollectionItemsQueryParams.TYPES) ?? undefined

    const typesQuery = typesParam
      ?.split(',')
      .map((type) => decodeURIComponent(type))
      .filter((type) =>
        Object.values(CollectionItemType).includes(type as CollectionItemType)
      ) as CollectionItemType[]

    const filtersParam = searchParams.get(CollectionItemsQueryParams.FILTER_QUERIES) ?? undefined

    const filtersQuery: FilterQuery[] | undefined = filtersParam
      ? (filtersParam
          ?.split(',')
          .map((filterQuery) => decodeURIComponent(filterQuery))
          .filter((decodedFilter) => /^[^:]+:[^:]+$/.test(decodedFilter)) as FilterQuery[])
      : undefined

    // If we don't have a sort query parameter, we default to RELEVANCE if there is a search query or DATE otherwise.
    const sortQuery =
      (searchParams.get(CollectionItemsQueryParams.SORT) as SortType) ??
      (searchQuery && searchQuery.length > 0 ? SortType.SCORE : SortType.DATE)

    const orderQuery =
      (searchParams.get(CollectionItemsQueryParams.ORDER) as OrderType) ?? OrderType.DESC

    return { pageQuery, searchQuery, typesQuery, filtersQuery, sortQuery, orderQuery }
  }

  static isRootCollection(collectionHierarchy: Collection['hierarchy']) {
    return !collectionHierarchy.parent
  }

  static getParentCollection(
    collectionHierarchy: Collection['hierarchy']
  ): UpwardHierarchyNode | undefined {
    return collectionHierarchy.parent
  }
}
