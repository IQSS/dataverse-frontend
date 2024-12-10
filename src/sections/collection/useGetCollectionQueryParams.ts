import { useSearchParams } from 'react-router-dom'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { FilterQuery } from '@/collection/domain/models/GetCollectionItemsQueryParams'
import { CollectionHelper } from './CollectionHelper'

export interface UseCollectionQueryParamsReturnType {
  pageQuery: number
  searchQuery?: string
  typesQuery?: CollectionItemType[]
  filtersQuery?: FilterQuery[]
}

export const useGetCollectionQueryParams = (): UseCollectionQueryParamsReturnType => {
  const [searchParams] = useSearchParams()

  const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

  return collectionQueryParams
}
