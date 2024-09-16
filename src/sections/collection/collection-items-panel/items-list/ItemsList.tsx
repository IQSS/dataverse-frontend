import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { UseInfiniteScrollHookRefCallback } from 'react-infinite-scroll-hook'
import cn from 'classnames'
import { CollectionItem } from '../../../../collection/domain/models/CollectionItemSubset'
import { CollectionItemsPaginationInfo } from '../../../../collection/domain/models/CollectionItemsPaginationInfo'
import { PaginationResultsInfo } from '../../../shared/pagination/PaginationResultsInfo'
import { ErrorItemsMessage } from './ErrorItemsMessage'
import { NoItemsMessage } from './NoItemsMessage'
import { NO_COLLECTION_ITEMS } from '../useGetAccumulatedItems'
import styles from './ItemsList.module.scss'

interface ItemsListProps {
  items: CollectionItem[]
  error: string | null
  accumulatedCount: number
  areItemsAvailable: boolean
  hasNextPage: boolean
  isEmptyItems: boolean
  paginationInfo: CollectionItemsPaginationInfo
  rootRef: any
  sentryRef: UseInfiniteScrollHookRefCallback
}

export const ItemsList = ({
  items,
  error,
  accumulatedCount,
  areItemsAvailable,
  hasNextPage,
  isEmptyItems,
  paginationInfo,
  rootRef,
  sentryRef
}: ItemsListProps) => {
  return (
    <div
      className={cn(styles['items-list'], {
        [styles['empty-or-error']]: isEmptyItems || error
      })}
      ref={rootRef}>
      {isEmptyItems && <NoItemsMessage />}

      {error && <ErrorItemsMessage errorMessage={error} />}

      {areItemsAvailable && (
        <>
          <header>
            <PaginationResultsInfo paginationInfo={paginationInfo} accumulated={accumulatedCount} />
          </header>
          <ul>
            {items.map((collectionItem, index) => {
              return (
                <li
                  key={index}
                  // key={`${dataset.persistentId}-${dataset.version.id}`}
                >
                  <p>A collection item</p>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {hasNextPage && !error && !isEmptyItems && (
        <div ref={sentryRef} data-testid="collection-items-list-infinite-scroll-skeleton">
          <SkeletonTheme>
            {accumulatedCount === NO_COLLECTION_ITEMS && <InitialLoadingSkeleton />}
            <LoadingSkeleton />
          </SkeletonTheme>
        </div>
      )}
    </div>
  )
}

export const InitialLoadingSkeleton = () => (
  <>
    <div
      className={styles['pagination-results-skeleton']}
      data-testid="collection-items-list-infinite-scroll-skeleton-header">
      <Skeleton width="17%" />
    </div>
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
  </>
)

export const LoadingSkeleton = () => (
  <>
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
  </>
)
