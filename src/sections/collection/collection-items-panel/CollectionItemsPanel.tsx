import { useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '../../../collection/domain/models/CollectionItemsPaginationInfo'
import { TemporarySearchCriteria, useGetAccumulatedItems } from './useGetAccumulatedItems'
import { FilterPanel } from './filter-panel/FilterPanel'
import { ItemsList } from './items-list/ItemsList'
import { SearchPanel } from './search-panel/SearchPanel'
import styles from './CollectionItemsPanel.module.scss'
import { useLoading } from '../../loading/LoadingContext'

const PAGE_SIZE = 10
const INITIAL_PAGE = 1

interface ItemsPanelProps {
  collectionId: string
  collectionRepository: CollectionRepository
  addDataSlot: JSX.Element | null
}

export const CollectionItemsPanel = ({
  collectionId,
  collectionRepository,
  addDataSlot
}: ItemsPanelProps) => {
  const { setIsLoading } = useLoading()
  const [searchCriteria, setSearchCriteria] = useState<TemporarySearchCriteria>({})
  const [paginationInfo, setPaginationInfo] = useState<CollectionItemsPaginationInfo>(
    new CollectionItemsPaginationInfo(INITIAL_PAGE)
  )
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
    collectionId,
    paginationInfo
  })

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoadingItems,
    hasNextPage: hasNextPage,
    onLoadMore: () => void handleOnLoadMore(paginationInfo),
    disabled: !!error,
    rootMargin: '0px 0px 250px 0px'
  })

  console.log({
    accumulatedItems,
    accumulatedCount,
    areItemsAvailable,
    error,
    hasNextPage,
    isLoadingItems,
    isEmptyItems,
    totalAvailable
  })

  async function handleOnLoadMore(currentPagination: CollectionItemsPaginationInfo) {
    let paginationInfoToSend = currentPagination
    if (totalAvailable !== undefined) {
      paginationInfoToSend = currentPagination.goToNextPage()
    }
    const totalFilesCount = await loadMore(paginationInfoToSend, searchCriteria)

    if (totalFilesCount !== undefined) {
      const paginationInfoUpdated = paginationInfoToSend.withTotal(totalFilesCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const handleCriteriaChange = async (newCriteria: any) => {
    // scrollableContainerRef.current?.scrollTo({ top: 0 })
    // setCriteria(newCriteria)
    // const resetedPaginationInfo = new FilePaginationInfo()
    // setPaginationInfo(resetedPaginationInfo)
    // const totalFilesCount = await loadMore(resetedPaginationInfo, newCriteria, true)
    // if (totalFilesCount !== undefined) {
    //   const paginationInfoUpdated = resetedPaginationInfo.withTotal(totalFilesCount)
    //   setPaginationInfo(paginationInfoUpdated)
    // }
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
          areItemsAvailable={areItemsAvailable}
          hasNextPage={hasNextPage}
          isEmptyItems={isEmptyItems}
          paginationInfo={paginationInfo}
          rootRef={rootRef}
          sentryRef={sentryRef}
        />
      </div>
    </section>
  )
}
