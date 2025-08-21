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
      ? filtersParam
          ?.split(',')
          .map((fq) => {
            try {
              return decodeURIComponent(fq)
            } catch {
              return fq // To be tolerant to bad encoding
            }
          })
          .map((fq) => {
            const keyAndValue = this.splitFilterQueryKeyAndValue(fq)
            if (keyAndValue === null) return null

            const { filterQueryKey, filterQueryValue } = keyAndValue

            return `${filterQueryKey}:${filterQueryValue}`
          })
          .filter((x): x is FilterQuery => x !== null)
      : undefined

    // If we don't have a sort query parameter, we default to RELEVANCE if there is a search query or DATE otherwise.
    const sortQuery =
      (searchParams.get(CollectionItemsQueryParams.SORT) as SortType) ??
      (searchQuery && searchQuery.length > 0 ? SortType.SCORE : SortType.DATE)

    const orderQuery =
      (searchParams.get(CollectionItemsQueryParams.ORDER) as OrderType) ?? OrderType.DESC

    return { pageQuery, searchQuery, typesQuery, filtersQuery, sortQuery, orderQuery }
  }
  /**
   * Splits a filter query string into its key and value parts.
   * Returns null if the format is invalid.
   */
  static splitFilterQueryKeyAndValue(filterQuery: string): {
    filterQueryKey: string
    filterQueryValue: string
  } | null {
    const idx = filterQuery.indexOf(':')
    // If idx === -1 there is no colon at all, invalid.
    // If idx === 0 colon is the first character, means the key is empty (":value"), invalid.
    // If idx === filterQuery.length - 1 colon is the last character, means the value is empty ("key:"), invalid.
    if (idx <= 0 || idx === filterQuery.length - 1) return null

    const filterQueryKey = filterQuery.slice(0, idx).trim()
    const filterQueryValue = filterQuery.slice(idx + 1).trim()

    // !filterQueryKey means the key is empty, invalid.
    // !filterQueryValue means the value is empty after trimming, invalid.
    // /[:\s]/.test(filterQueryKey) checks if the key contains a colon or whitespace, which is invalid.
    if (!filterQueryKey || !filterQueryValue || /[:\s]/.test(filterQueryKey)) return null

    return {
      filterQueryKey,
      filterQueryValue
    }
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
