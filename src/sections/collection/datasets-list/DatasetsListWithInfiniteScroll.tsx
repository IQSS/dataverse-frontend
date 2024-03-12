import { useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import cn from 'classnames'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { PaginationResultsInfo } from '../../shared/pagination/PaginationResultsInfo'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { useLoading } from '../../loading/LoadingContext'
import { NoDatasetsMessage } from './NoDatasetsMessage'
import { DatasetCard } from './dataset-card/DatasetCard'
import styles from './DatasetsList.module.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import { ErrorDatasetsMessage } from './ErrorDatasetsMessage'
import { useLoadDatasets } from './useLoadDatasets'

interface DatasetsListWithInfiniteScrollProps {
  datasetRepository: DatasetRepository
  collectionId: string
}
const NO_DATASETS = 0
const PAGE_SIZE = 10

export function DatasetsListWithInfiniteScroll({
  datasetRepository,
  collectionId
}: DatasetsListWithInfiniteScrollProps) {
  const { setIsLoading } = useLoading()
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo>(
    new DatasetPaginationInfo(1)
  )
  const { isLoading, accumulatedDatasets, totalAvailable, hasNextPage, error, loadMore } =
    useLoadDatasets(datasetRepository, collectionId, paginationInfo)

  const isEmptyDatasets = totalAvailable === NO_DATASETS
  const areDatasetsAvailable =
    typeof totalAvailable === 'number' && totalAvailable > NO_DATASETS && !error
  const accumulatedCount = accumulatedDatasets.length

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: loadMore as VoidFunction,
    disabled: !!error,
    rootMargin: '0px 0px 250px 0px'
  })

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  useEffect(() => {
    // Update total items of pagination
    if (totalAvailable && totalAvailable !== paginationInfo.totalItems) {
      setPaginationInfo(paginationInfo.withTotal(totalAvailable))
    }
  }, [totalAvailable, paginationInfo])

  useEffect(() => {
    // Update page number
    setPaginationInfo((currentPagination) =>
      currentPagination.goToPage(accumulatedCount / PAGE_SIZE + 1)
    )
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
            {accumulatedCount === NO_DATASETS && (
              <div
                className={styles['sticky-pagination-results']}
                data-testid="datasets-list-infinite-scroll-skeleton-header">
                <Skeleton width="17%" />
              </div>
            )}
            {/* Show 3 skeletons when reaching to the bottom if has next page or is loading */}
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            {/* Show all 10 skeletons on first loading */}
            {accumulatedCount === NO_DATASETS && (
              <>
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
                <Skeleton height="109px" style={{ marginBottom: 6 }} />
              </>
            )}
          </SkeletonTheme>
        </div>
      )}
    </section>
  )
}
