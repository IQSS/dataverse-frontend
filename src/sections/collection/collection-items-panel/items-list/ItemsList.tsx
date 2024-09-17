import { ForwardedRef, forwardRef } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import cn from 'classnames'
import { type CollectionItem } from '../../../../collection/domain/models/CollectionItemSubset'
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
  isLoadingItems: boolean
  areItemsAvailable: boolean
  hasNextPage: boolean
  isEmptyItems: boolean
  paginationInfo: CollectionItemsPaginationInfo
  onLoadMore: (paginationInfo: CollectionItemsPaginationInfo) => void
}

export const ItemsList = forwardRef(
  (
    {
      items,
      error,
      accumulatedCount,
      isLoadingItems,
      areItemsAvailable,
      hasNextPage,
      isEmptyItems,
      paginationInfo,
      onLoadMore
    }: ItemsListProps,
    ref
  ) => {
    const [sentryRef, { rootRef }] = useInfiniteScroll({
      loading: isLoadingItems,
      hasNextPage: hasNextPage,
      onLoadMore: () => void onLoadMore(paginationInfo),
      disabled: !!error,
      rootMargin: '0px 0px 250px 0px'
    })

    return (
      <section ref={rootRef}>
        <div
          className={cn(styles['items-list'], {
            [styles['empty-or-error']]: isEmptyItems || error
          })}
          ref={ref as ForwardedRef<HTMLDivElement>}>
          {isEmptyItems && <NoItemsMessage />}

          {/* TODO:ME If there is a type or search applied, then message should not be no items message */}
          {/* There are no dataverses, datasets, or files that match your search. Please try a new search by using other or broader terms. You can also check out the [search guide] for tips. */}
          {/* https://guides.dataverse.org/en/latest/user/find-use-data.html */}

          {error && <ErrorItemsMessage errorMessage={error} />}

          {areItemsAvailable && (
            <>
              <header>
                <PaginationResultsInfo
                  paginationInfo={paginationInfo}
                  accumulated={accumulatedCount}
                />
              </header>

              {/* TODO:ME After updating js-dataverse use case, assert by the type wich card to render */}
              <ul>
                {items.map((collectionItem, index) => {
                  // console.log(collectionItem)

                  return (
                    <li
                      style={{ height: 100, border: 'solid 2px black' }}
                      key={index}
                      // key={`${dataset.persistentId}-${dataset.version.id}`}
                    >
                      <p>Assert type collection, dataset or file here</p>
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
      </section>
    )
  }
)

ItemsList.displayName = 'ItemsList'

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
