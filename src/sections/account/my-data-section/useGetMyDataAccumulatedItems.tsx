import { useMemo, useState } from 'react'
import { getMyDataCollectionItems } from '@/collection/domain/useCases/getMyDataCollectionItems'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItem, CountPerObjectType } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { MyDataSearchCriteria } from '@/sections/account/my-data-section/MyDataSearchCriteria'
import {
  MyDataCollectionItemSubset,
  PublicationStatusCount
} from '@/collection/domain/models/MyDataCollectionItemSubset'

export const NO_COLLECTION_ITEMS = 0

type UseGetMyDataAccumulatedItemsReturnType = {
  isLoadingItems: boolean
  accumulatedItems: CollectionItem[]
  publicationStatusCounts: PublicationStatusCount[]
  countPerObjectType: CountPerObjectType
  totalAvailable: number | undefined
  hasNextPage: boolean
  error: string | null
  loadMore: (
    paginationInfo: CollectionItemsPaginationInfo,
    criteria: MyDataSearchCriteria,
    resetAccumulated?: boolean
  ) => Promise<number | undefined>
  isEmptyItems: boolean
  areItemsAvailable: boolean
  accumulatedCount: number
}

type UseGetAccumulatedItemsParams = {
  collectionRepository: CollectionRepository
}

export const useGetMyDataAccumulatedItems = ({
  collectionRepository
}: UseGetAccumulatedItemsParams): UseGetMyDataAccumulatedItemsReturnType => {
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [accumulatedItems, setAccumulatedItems] = useState<CollectionItem[]>([])
  const [publicationStatusCounts, setPublicationStatusCounts] = useState<PublicationStatusCount[]>(
    []
  )
  const [countPerObjectType, setCountPerObjectType] = useState<CountPerObjectType>({
    collections: 0,
    datasets: 0,
    files: 0
  })
  const [hasNextPage, setHasNextPage] = useState<boolean>(true)
  const [totalAvailable, setTotalAvailable] = useState<number | undefined>(undefined)
  const [error, setError] = useState<string | null>(null)

  const isEmptyItems = useMemo(() => totalAvailable === NO_COLLECTION_ITEMS, [totalAvailable])
  const areItemsAvailable = useMemo(() => {
    return typeof totalAvailable === 'number' && totalAvailable > NO_COLLECTION_ITEMS && !error
  }, [totalAvailable, error])
  const accumulatedCount = useMemo(() => accumulatedItems.length, [accumulatedItems])

  const loadMore = async (
    pagination: CollectionItemsPaginationInfo,
    searchCriteria: MyDataSearchCriteria,
    resetAccumulated = false
  ): Promise<number | undefined> => {
    setIsLoadingItems(true)

    try {
      const { items, publicationStatusCounts, totalItemCount, countPerObjectType } =
        await loadNextItems(collectionRepository, pagination, searchCriteria)

      const newAccumulatedItems = !resetAccumulated ? [...accumulatedItems, ...items] : items

      setAccumulatedItems(newAccumulatedItems)

      setPublicationStatusCounts(publicationStatusCounts)

      setCountPerObjectType(countPerObjectType)

      setTotalAvailable(totalItemCount)

      const isNextPage = !resetAccumulated
        ? newAccumulatedItems.length < totalItemCount
        : items.length < totalItemCount

      setHasNextPage(isNextPage)

      if (!isNextPage) {
        setIsLoadingItems(false)
      }

      return totalItemCount
    } catch (err) {
      const errorMessage =
        err instanceof Error && err.message
          ? err.message
          : 'Something went wrong getting the collection items'
      setError(errorMessage)
    } finally {
      setIsLoadingItems(false)
    }
  }

  return {
    isLoadingItems,
    accumulatedItems,
    publicationStatusCounts,
    countPerObjectType,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    isEmptyItems,
    areItemsAvailable,
    accumulatedCount
  }
}

async function loadNextItems(
  collectionRepository: CollectionRepository,
  paginationInfo: CollectionItemsPaginationInfo,
  searchCriteria: MyDataSearchCriteria
): Promise<MyDataCollectionItemSubset> {
  const publicationStatuses = (searchCriteria.publicationStatuses as string[]) ?? []
  return await getMyDataCollectionItems(
    collectionRepository,
    searchCriteria.roleIds,
    searchCriteria.itemTypes,
    publicationStatuses,
    paginationInfo.pageSize,
    paginationInfo.page,
    searchCriteria.searchText,
    searchCriteria.otherUserName
  )
}
