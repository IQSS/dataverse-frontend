import { useEffect, useRef, useState } from 'react'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '../../../collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionSearchCriteria } from '../../../collection/domain/models/CollectionSearchCriteria'
import { useGetAccumulatedItems } from './useGetAccumulatedItems'
import { UseCollectionQueryParamsReturnType } from '../useCollectionQueryParams'
import { useLoading } from '../../loading/LoadingContext'
import { FilterPanel } from './filter-panel/FilterPanel'
import { ItemsList } from './items-list/ItemsList'
import { SearchPanel } from './search-panel/SearchPanel'
import styles from './CollectionItemsPanel.module.scss'

interface ItemsPanelProps {
  collectionId: string
  collectionRepository: CollectionRepository
  collectionQueryParams: UseCollectionQueryParamsReturnType
  addDataSlot: JSX.Element | null
}

export const CollectionItemsPanel = ({
  collectionId,
  collectionRepository,
  collectionQueryParams,
  addDataSlot
}: ItemsPanelProps) => {
  const { setIsLoading } = useLoading()

  const initialSearchCriteria = new CollectionSearchCriteria(
    collectionQueryParams.searchQuery,
    collectionQueryParams.typesQuery
  )

  console.log({ initialSearchCriteria })

  const [searchCriteria, setSearchCriteria] =
    useState<CollectionSearchCriteria>(initialSearchCriteria)

  const [paginationInfo, setPaginationInfo] = useState<CollectionItemsPaginationInfo>(
    new CollectionItemsPaginationInfo()
  )
  const itemsListContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    isLoadingItems,
    accumulatedItems,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    isEmptyItems,
    areItemsAvailable,
    accumulatedCount
  } = useGetAccumulatedItems({
    collectionRepository,
    collectionId
  })

  async function handleOnLoadMore(currentPagination: CollectionItemsPaginationInfo) {
    let paginationInfoToSend = currentPagination
    if (totalAvailable !== undefined) {
      paginationInfoToSend = currentPagination.goToNextPage()
    }
    console.log('paginationInfoToSend', paginationInfoToSend)
    const totalItemsCount = await loadMore(paginationInfoToSend, searchCriteria)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = paginationInfoToSend.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  // This function is called when the user changes the search criteria (search input, filters, etc.)
  const handleCriteriaChange = async (newCriteria: CollectionSearchCriteria) => {
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    setSearchCriteria(newCriteria)

    const resetedPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetedPaginationInfo)

    const totalItemsCount = await loadMore(resetedPaginationInfo, newCriteria, true)
    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetedPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  useEffect(() => {
    setIsLoading(isLoadingItems)
  }, [isLoadingItems, setIsLoading])

  return (
    <section className={styles['items-panel']}>
      <header className={styles['top-wrapper']}>
        <SearchPanel />
        <div className={styles['add-data-slot']}>{addDataSlot}</div>
      </header>

      <div className={styles['bottom-wrapper']}>
        <FilterPanel />

        <ItemsList
          items={accumulatedItems}
          error={error}
          accumulatedCount={accumulatedCount}
          isLoadingItems={isLoadingItems}
          areItemsAvailable={areItemsAvailable}
          hasNextPage={hasNextPage}
          isEmptyItems={isEmptyItems}
          hasSearchValue={searchCriteria.hasSearchText()}
          paginationInfo={paginationInfo}
          onLoadMore={handleOnLoadMore}
          ref={itemsListContainerRef}
        />
      </div>
    </section>
  )
}
