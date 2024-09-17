import { useSearchParams } from 'react-router-dom'
import { QueryParamKey } from '../Route.enum'
import { CollectionItemType } from '../../collection/domain/models/CollectionItemType'

export interface UseCollectionQueryParamsReturnType {
  pageQuery: number
  searchQuery?: string
  typesQuery?: CollectionItemType[]
}

export const useCollectionQueryParams = (): UseCollectionQueryParamsReturnType => {
  const [searchParams] = useSearchParams()

  const pageQuery = searchParams.get('page') ? parseInt(searchParams.get('page') as string, 10) : 1

  const searchQuery = searchParams.get(QueryParamKey.QUERY) ?? undefined

  const typesParam = searchParams.get(QueryParamKey.COLLECTION_ITEM_TYPES) ?? undefined

  const typesQuery = typesParam
    ?.split(',')
    .map((type) => decodeURIComponent(type))
    .filter((type) =>
      Object.values(CollectionItemType).includes(type as CollectionItemType)
    ) as CollectionItemType[]

  return { pageQuery, searchQuery, typesQuery }
}
