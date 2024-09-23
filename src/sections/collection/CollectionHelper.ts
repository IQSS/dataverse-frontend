import { CollectionItemType } from '../../collection/domain/models/CollectionItemType'
import { QueryParamKey } from '../Route.enum'

export class CollectionHelper {
  static defineCollectionQueryParams(searchParams: URLSearchParams) {
    const pageQuery = searchParams.get('page')
      ? parseInt(searchParams.get('page') as string, 10)
      : 1

    const searchQuery = searchParams.get(QueryParamKey.QUERY)
      ? decodeURIComponent(searchParams.get(QueryParamKey.QUERY) as string)
      : undefined

    const typesParam = searchParams.get(QueryParamKey.COLLECTION_ITEM_TYPES) ?? undefined

    const typesQuery = typesParam
      ?.split(',')
      .map((type) => decodeURIComponent(type))
      .filter((type) =>
        Object.values(CollectionItemType).includes(type as CollectionItemType)
      ) as CollectionItemType[]

    return { pageQuery, searchQuery, typesQuery }
  }
}
