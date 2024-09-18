import { ForwardedRef, forwardRef } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import cn from 'classnames'
import { type CollectionItem } from '../../../../collection/domain/models/CollectionItemSubset'
import { CollectionItemsPaginationInfo } from '../../../../collection/domain/models/CollectionItemsPaginationInfo'
import { PaginationResultsInfo } from '../../../shared/pagination/PaginationResultsInfo'
import { ErrorItemsMessage } from './ErrorItemsMessage'
import { NoItemsMessage } from './NoItemsMessage'
import { NoSearchMatchesMessage } from './NoSearchMatchesMessage'
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
  hasSearchValue: boolean
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
      hasSearchValue,
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
          {isEmptyItems && !hasSearchValue && <NoItemsMessage />}
          {isEmptyItems && hasSearchValue && <NoSearchMatchesMessage />}

          {error && <ErrorItemsMessage errorMessage={error} />}

          {areItemsAvailable && (
            <>
              <header>
                {/* TODO:ME Maybe show skeleton while loading or prevent 0 in total results somehow */}
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
                      <p>
                        This is a : {collectionItem?.type === 'file' && 'File'}
                        {collectionItem?.type === 'dataset' && 'Dataset'}
                        {collectionItem?.type === 'collection' && 'Collection'}
                      </p>
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
