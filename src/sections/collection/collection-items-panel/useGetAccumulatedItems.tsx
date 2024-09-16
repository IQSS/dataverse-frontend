import { useMemo, useState } from 'react'

import { getCollectionItems } from '../../../collection/domain/useCases/getCollectionItems'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import {
  CollectionItem,
  CollectionItemSubset
} from '../../../collection/domain/models/CollectionItemSubset'
import { CollectionItemsPaginationInfo } from '../../../collection/domain/models/CollectionItemsPaginationInfo'

export type TemporarySearchCriteria = {}

export const NO_COLLECTION_ITEMS = 0

type UseGetAccumulatedItemsReturnType = {
  isLoadingItems: boolean
  accumulatedItems: CollectionItem[]
  totalAvailable: number | undefined
  hasNextPage: boolean
  error: string | null
  loadMore: (
    paginationInfo: CollectionItemsPaginationInfo,
    criteria: TemporarySearchCriteria,
    resetAccumulated?: boolean
  ) => Promise<number | undefined>
  isEmptyItems: boolean
  areItemsAvailable: boolean
  accumulatedCount: number
}

type UseGetAccumulatedItemsParams = {
  collectionRepository: CollectionRepository
  collectionId: string
  paginationInfo: CollectionItemsPaginationInfo
}

export const useGetAccumulatedItems = ({
  collectionRepository,
  collectionId,
  paginationInfo
}: UseGetAccumulatedItemsParams): UseGetAccumulatedItemsReturnType => {
  const [isLoadingItems, setIsLoadingItems] = useState(false)
  const [accumulatedItems, setAccumulatedItems] = useState<CollectionItem[]>([])
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
    criteria: TemporarySearchCriteria,
    resetAccumulated = false
  ): Promise<number | undefined> => {
    setIsLoadingItems(true)

    try {
      const { items, totalItemCount } = await loadNextItems(
        collectionRepository,
        collectionId,
        pagination,
        criteria
      )

      const newAccumulatedItems = !resetAccumulated ? [...accumulatedItems, ...items] : items

      setAccumulatedItems(newAccumulatedItems)

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
  collectionId: string,
  paginationInfo: CollectionItemsPaginationInfo,
  _criteria: TemporarySearchCriteria
): Promise<CollectionItemSubset> {
  return getCollectionItems(collectionRepository, collectionId, paginationInfo).catch(
    (err: Error) => {
      throw new Error(err.message)
    }
  )
}
