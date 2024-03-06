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
import { PageNumberNotFound } from './PageNumberNotFound'
import styles from './DatasetsList.module.scss'

interface DatasetsListWithInfiniteScrollProps {
  datasetRepository: DatasetRepository
  collectionId: string
  page?: number
}
const NO_DATASETS = 0

export function DatasetsListWithInfiniteScroll({
  datasetRepository,
  page,
  collectionId
}: DatasetsListWithInfiniteScrollProps) {
  const { setIsLoading } = useLoading()
  const [paginationInfo, setPaginationInfo] = useState<DatasetPaginationInfo>(
    new DatasetPaginationInfo(page)
  )
  const { accumulatedDatasets, isLoading, pageNumberNotFound } = useDatasets(
    datasetRepository,
    collectionId,
    setPaginationInfo,
    paginationInfo
  )

  const hasNextPage = accumulatedDatasets.length < paginationInfo.totalItems
  const emptyDatasets = accumulatedDatasets.length === NO_DATASETS

  const loadMore = () => {
    console.log('time to load more')
    setPaginationInfo(paginationInfo.goToNextPage())
  }

  const [sentryRef, { rootRef }] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNextPage,
    onLoadMore: loadMore,
    // disabled: !!error,
    rootMargin: '0px 0px 400px 0px'
  })

  useEffect(() => {
    setIsLoading(isLoading)
  }, [isLoading])

  if (pageNumberNotFound) {
    return (
      <section className={styles.container}>
        <PageNumberNotFound />
      </section>
    )
  }

  return (
    <section
      className={cn(styles['scrollable-container'], {
        [styles['scrollable-container--empty-datasets']]: emptyDatasets && !isLoading
      })}
      ref={rootRef}>
      {emptyDatasets && !isLoading ? <NoDatasetsMessage /> : null}
      {!emptyDatasets ? (
        <>
          <div className={styles['sticky-pagination-results']}>
            <PaginationResultsInfo paginationInfo={paginationInfo} forInfiniteScrolling />
          </div>
          {accumulatedDatasets.map((dataset) => (
            <DatasetCard dataset={dataset} key={dataset.persistentId} />
          ))}
        </>
      ) : null}
      {(isLoading || hasNextPage) && (
        <div ref={sentryRef}>
          <SkeletonTheme>
            {emptyDatasets && (
              <div className={styles['sticky-pagination-results']}>
                <Skeleton width="14%" />
              </div>
            )}

            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
            <Skeleton height="109px" style={{ marginBottom: 6 }} />
          </SkeletonTheme>
        </div>
      )}
    </section>
  )
}
