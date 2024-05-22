import { useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import cn from 'classnames'
import { SkeletonTheme } from 'react-loading-skeleton'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { PaginationResultsInfo } from '../../shared/pagination/PaginationResultsInfo'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { useLoading } from '../../loading/LoadingContext'
import { NoDatasetsMessage } from './NoDatasetsMessage'
import { DatasetCard } from './dataset-card/DatasetCard'
import { InitialLoadingSkeleton, LoadingSkeleton } from './DatasetsListWithInfiniteScrollSkeletons'
import { ErrorDatasetsMessage } from './ErrorDatasetsMessage'
import { NO_DATASETS, useLoadDatasets } from './useLoadDatasets'
import styles from './DatasetsList.module.scss'
import 'react-loading-skeleton/dist/skeleton.css'

interface DatasetsListWithInfiniteScrollProps {
  datasetRepository: DatasetRepository
  collectionId: string
}

const PAGE_SIZE = 10
const INITIAL_PAGE = 1

export function DatasetsListWithInfiniteScroll({
  datasetRepository,
  collectionId
}: DatasetsListWithInfiniteScrollProps) {
  const { setIsLoading } = useLoading()
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo>(
    new DatasetPaginationInfo(INITIAL_PAGE)
  )
  const {
    isLoading,
    accumulatedDatasets,
    totalAvailable,
    hasNextPage,
    error,
    loadMore,
    isEmptyDatasets,
    areDatasetsAvailable,
    accumulatedCount
  } = useLoadDatasets(datasetRepository, collectionId, paginationInfo)

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: loadMore as VoidFunction,
    disabled: !!error,
    rootMargin: '0px 0px 250px 0px'
  })

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading, setIsLoading])

  useEffect(() => {
    const updatePaginationTotalItems = () => {
      if (totalAvailable && totalAvailable !== paginationInfo.totalItems) {
        setPaginationInfo(paginationInfo.withTotal(totalAvailable))
      }
    }

    updatePaginationTotalItems()
  }, [totalAvailable, paginationInfo])

  useEffect(() => {
    const updatePaginationPageNumber = () => {
      setPaginationInfo((currentPagination) =>
        currentPagination.goToPage(accumulatedCount / PAGE_SIZE + 1)
      )
    }

    updatePaginationPageNumber()
  }, [accumulatedCount])

  return (
    <section
      className={cn(styles['scrollable-container'], {
        [styles['scrollable-container--empty-or-error']]: isEmptyDatasets || error
      })}
      ref={rootRef}
      tabIndex={0}
      data-testid="scrollable-container">
      {isEmptyDatasets && <NoDatasetsMessage />}

      {error && <ErrorDatasetsMessage errorMessage={error} />}

      {areDatasetsAvailable && (
        <>
          <div className={styles['sticky-pagination-results']}>
            <PaginationResultsInfo paginationInfo={paginationInfo} accumulated={accumulatedCount} />
          </div>
          {accumulatedDatasets.map((dataset) => (
            <DatasetCard dataset={dataset} key={dataset.persistentId} />
          ))}
        </>
      )}

      {hasNextPage && !error && !isEmptyDatasets && (
        <div ref={sentryRef} data-testid="datasets-list-infinite-scroll-skeleton">
          <SkeletonTheme>
            {accumulatedCount === NO_DATASETS && <InitialLoadingSkeleton />}
            <LoadingSkeleton />
          </SkeletonTheme>
        </div>
      )}
    </section>
  )
}
