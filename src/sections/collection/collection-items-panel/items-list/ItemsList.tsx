import { ForwardedRef, forwardRef } from 'react'
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import cn from 'classnames'
import { type CollectionItem } from '@/collection/domain/models/CollectionItemSubset'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import {
  FilterQuery,
  SortType,
  OrderType
} from '@/collection/domain/models/CollectionSearchCriteria'
import { PaginationResultsInfo } from '@/sections/shared/pagination/PaginationResultsInfo'
import { NO_COLLECTION_ITEMS } from '../useGetAccumulatedItems'
import { ErrorItemsMessage } from './ErrorItemsMessage'
import { NoItemsMessage } from './NoItemsMessage'
import { NoSearchMatchesMessage } from './NoSearchMatchesMessage'
import { CollectionCard } from './collection-card/CollectionCard'
import { DatasetCard } from './dataset-card/DatasetCard'
import { FileCard } from './file-card/FileCard'
import styles from './ItemsList.module.scss'
import { Col, Row } from '@iqss/dataverse-design-system'
import { ItemsSortBy } from '@/sections/collection/collection-items-panel/items-list/ItemsSortBy'

interface ItemsListProps {
  parentCollectionAlias: string
  items: CollectionItem[]
  error: string | null
  accumulatedCount: number
  isLoadingItems: boolean
  areItemsAvailable: boolean
  hasNextPage: boolean
  isEmptyItems: boolean
  hasSearchValue: boolean
  paginationInfo: CollectionItemsPaginationInfo
  onBottomReach: (paginationInfo: CollectionItemsPaginationInfo) => void
  onSortChange: (newSortType?: SortType, newOrderType?: OrderType) => void
  itemsTypesSelected: CollectionItemType[]
  filterQueriesSelected: FilterQuery[]
  sortSelected?: SortType
  orderSelected?: OrderType
  searchText?: string
}

export const ItemsList = forwardRef(
  (
    {
      parentCollectionAlias,
      items,
      error,
      accumulatedCount,
      isLoadingItems,
      areItemsAvailable,
      hasNextPage,
      isEmptyItems,
      hasSearchValue,
      paginationInfo,
      onBottomReach,
      onSortChange,
      itemsTypesSelected,
      filterQueriesSelected,
      sortSelected,
      orderSelected
    }: ItemsListProps,
    ref
  ) => {
    const [sentryRef, { rootRef }] = useInfiniteScroll({
      loading: isLoadingItems,
      hasNextPage: hasNextPage,
      onLoadMore: () => void onBottomReach(paginationInfo),
      disabled: !!error,
      rootMargin: '0px 0px 250px 0px'
    })

    const showNoItemsMessage =
      !isLoadingItems && isEmptyItems && !hasSearchValue && filterQueriesSelected.length === 0
    const showNoSearchMatchesMessage =
      !isLoadingItems && isEmptyItems && (hasSearchValue || filterQueriesSelected.length > 0)

    const showSentrySkeleton = hasNextPage && !error && !isEmptyItems
    const showNotSentrySkeleton = isLoadingItems && isEmptyItems

    return (
      <section ref={rootRef} className={styles['items-list-root-ref']}>
        <div
          className={cn(styles['items-list'], {
            [styles['empty-or-error']]: isEmptyItems || error,
            [styles['only-one-or-two-items']]: items.length === 1 || items.length === 2
          })}
          tabIndex={0}
          ref={ref as ForwardedRef<HTMLDivElement>}
          data-testid="items-list-scrollable-container">
          {showNoItemsMessage && <NoItemsMessage itemsTypesSelected={itemsTypesSelected} />}

          {showNoSearchMatchesMessage && <NoSearchMatchesMessage />}

          {error && <ErrorItemsMessage errorMessage={error} />}

          {areItemsAvailable && (
            <>
              <header>
                <Row>
                  <Col>
                    {isLoadingItems ? (
                      <SkeletonTheme>
                        <Skeleton height={19} width={190} />
                      </SkeletonTheme>
                    ) : (
                      <PaginationResultsInfo
                        paginationInfo={paginationInfo}
                        accumulated={accumulatedCount}
                      />
                    )}
                  </Col>
                  <Col className={styles['sort-button']}>
                    <ItemsSortBy
                      isLoadingCollectionItems={isLoadingItems}
                      currentSortType={sortSelected}
                      currentSortOrder={orderSelected}
                      hasSearchValue={hasSearchValue}
                      onSortChange={onSortChange}></ItemsSortBy>
                  </Col>
                </Row>
              </header>

              <ul data-testid="items-list">
                {items.map((collectionItem, index) => (
                  <li key={`${collectionItem.type}-${index}`}>
                    {collectionItem?.type === CollectionItemType.COLLECTION && (
                      <CollectionCard
                        parentCollectionAlias={parentCollectionAlias}
                        collectionPreview={collectionItem}
                      />
                    )}
                    {collectionItem?.type === CollectionItemType.DATASET && (
                      <DatasetCard datasetPreview={collectionItem} />
                    )}
                    {collectionItem?.type === CollectionItemType.FILE && (
                      <FileCard filePreview={collectionItem} />
                    )}
                  </li>
                ))}
              </ul>
            </>
          )}

          {showSentrySkeleton && (
            <div ref={sentryRef} data-testid="collection-items-list-infinite-scroll-skeleton">
              <SkeletonTheme>
                {accumulatedCount === NO_COLLECTION_ITEMS && <InitialLoadingSkeleton />}
                <LoadingSkeleton numOfSkeletons={3} />
              </SkeletonTheme>
            </div>
          )}
          {showNotSentrySkeleton && (
            <SkeletonTheme>
              <LoadingSkeleton numOfSkeletons={10} />
            </SkeletonTheme>
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
    <Skeleton height="109px" style={{ marginBottom: 6, marginTop: 16 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
    <Skeleton height="109px" style={{ marginBottom: 6 }} />
  </>
)

export const LoadingSkeleton = ({ numOfSkeletons }: { numOfSkeletons: number }) => (
  <>
    {Array.from({ length: numOfSkeletons }).map((_, index) => (
      <Skeleton key={index} height="109px" style={{ marginBottom: 6 }} />
    ))}
  </>
)
