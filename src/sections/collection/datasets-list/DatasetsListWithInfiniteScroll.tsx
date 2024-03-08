import { useEffect, useState } from 'react'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import cn from 'classnames'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { useDatasets } from './useDatasets'
import { DatasetRepository } from '../../../dataset/domain/repositories/DatasetRepository'
import { PaginationResultsInfo } from '../../shared/pagination/PaginationResultsInfo'
import { DatasetPaginationInfo } from '../../../dataset/domain/models/DatasetPaginationInfo'
import { useLoading } from '../../loading/LoadingContext'
import { NoDatasetsMessage } from './NoDatasetsMessage'
import { DatasetCard } from './dataset-card/DatasetCard'
import styles from './DatasetsList.module.scss'
import 'react-loading-skeleton/dist/skeleton.css'
import { ErrorDatasetsMessage } from './ErrorDatasetsMessage'

interface DatasetsListWithInfiniteScrollProps {
  datasetRepository: DatasetRepository
  collectionId: string
}
const NO_DATASETS = 0

export function DatasetsListWithInfiniteScroll({
  datasetRepository,
  collectionId
}: DatasetsListWithInfiniteScrollProps) {
  const { setIsLoading } = useLoading()
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo>(
    new DatasetPaginationInfo()
  )
  const { accumulatedDatasets, isLoading, error } = useDatasets(
    datasetRepository,
    collectionId,
    setPaginationInfo,
    paginationInfo
  )
  const accumulatedCount = accumulatedDatasets.length

  const emptyDatasets = accumulatedCount === NO_DATASETS
  const isDatasetsAvailable = !emptyDatasets && !error
  const isEmptyDatasets = emptyDatasets && !isLoading && !error
  const isErrorAfterLoading = !!error && !isLoading

  const hasNextPage = accumulatedCount < paginationInfo.totalItems

  const loadMore = () => {
    setPaginationInfo(paginationInfo.goToNextPage())
  }

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: loadMore,
    disabled: !!error,
    rootMargin: '0px 0px 250px 0px'
  })

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  return (
    <section
      className={cn(styles['scrollable-container'], {
        [styles['scrollable-container--empty-or-error']]: isEmptyDatasets || isErrorAfterLoading
      })}
      ref={rootRef}>
      {isEmptyDatasets && <NoDatasetsMessage />}

      {isErrorAfterLoading && <ErrorDatasetsMessage errorMessage={error} />}

      {isDatasetsAvailable && (
        <>
          <div className={styles['sticky-pagination-results']}>
            <PaginationResultsInfo paginationInfo={paginationInfo} accumulated={accumulatedCount} />
          </div>
          {accumulatedDatasets.map((dataset) => (
            <DatasetCard dataset={dataset} key={dataset.persistentId} />
          ))}
        </>
      )}

      {(isLoading || hasNextPage) && !error && (
        <div ref={sentryRef} data-testid="datasets-list-infinite-scroll-skeleton">
          <SkeletonTheme>
            {emptyDatasets && (
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
            {emptyDatasets && (
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
