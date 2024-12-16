import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import {
  FilterQuery,
  OrderType,
  SortType
} from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { QueryParamKey } from '../Route.enum'

export class CollectionHelper {
  static defineCollectionQueryParams(searchParams: URLSearchParams) {
    const pageQuery = searchParams.get('page')
      ? parseInt(searchParams.get('page') as string, 10)
      : 1

    const searchQuery = searchParams.get(QueryParamKey.QUERY)
      ? decodeURIComponent(searchParams.get(QueryParamKey.QUERY) as string)
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

    const sortQuery = (searchParams.get(CollectionItemsQueryParams.SORT) as SortType) ?? undefined
    const orderQuery =
      (searchParams.get(CollectionItemsQueryParams.ORDER) as OrderType) ?? undefined

    return { pageQuery, searchQuery, typesQuery, filtersQuery, sortQuery, orderQuery }
  }
}
