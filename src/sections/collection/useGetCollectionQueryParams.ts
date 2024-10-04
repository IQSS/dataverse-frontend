import { useSearchParams } from 'react-router-dom'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { CollectionHelper } from './CollectionHelper'

export interface UseCollectionQueryParamsReturnType {
  pageQuery: number
  searchQuery?: string
  typesQuery?: CollectionItemType[]
}

export const useGetCollectionQueryParams = (): UseCollectionQueryParamsReturnType => {
  const [searchParams] = useSearchParams()

  const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

  return collectionQueryParams
}
