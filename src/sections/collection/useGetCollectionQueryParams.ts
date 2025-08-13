import { useSearchParams } from 'react-router-dom'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import {
  FilterQuery,
  SortType,
  OrderType
} from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionHelper } from './CollectionHelper'

export interface UseCollectionQueryParamsReturnType {
  pageQuery: number
  searchQuery?: string
  typesQuery?: CollectionItemType[]
  filtersQuery?: FilterQuery[]
  sortQuery?: SortType
  orderQuery?: OrderType
}

export const useGetCollectionQueryParams = (): UseCollectionQueryParamsReturnType => {
  const [searchParams] = useSearchParams()

  const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

  return collectionQueryParams
}
