import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Stack } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import {
  CollectionSearchCriteria,
  FilterQuery,
  OrderType,
  SortType
} from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { useGetAccumulatedItems } from './useGetAccumulatedItems'
import { UseCollectionQueryParamsReturnType } from '../useGetCollectionQueryParams'
import { useLoadMoreOnPopStateEvent } from './useLoadMoreOnPopStateEvent'
import { useLoading } from '@/sections/loading/LoadingContext'
import { CollectionHelper } from '../CollectionHelper'
import { FilterPanel } from '@/sections/collection/collection-items-panel/filter-panel/FilterPanel'
import { RemoveAddFacetFilter } from '@/sections/collection/collection-items-panel/filter-panel/facets-filters/FacetFilterGroup'
import { ItemsList } from '@/sections/collection/collection-items-panel/items-list/ItemsList'
import { SearchPanel } from '@/sections/collection/collection-items-panel/search-panel/SearchPanel'
import { ItemTypeChange } from '@/sections/collection/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { SelectedFacets } from '@/sections/collection/collection-items-panel/selected-facets/SelectedFacets'
import styles from './CollectionItemsPanel.module.scss'

interface CollectionItemsPanelProps {
  collectionId: string
  collectionRepository: CollectionRepository
  collectionQueryParams: UseCollectionQueryParamsReturnType
  addDataSlot: JSX.Element | null
}

/**
 * HOW IT WORKS:
 * This component loads items on the following scenarios:
 * 1. When the component mounts
 * 2. When the user scrolls to the bottom of the list and there are more items to load
 * 3. When the user submits a search query in the search panel
 * 4. When the user changes the item types in the filter panel
 * 5. When the user selects or removes a facet filter
 * 6. When the user navigates back and forward in the browser
 * 7. When the user changes the sort and order of the items
 *
 * It initializes the search criteria with the query params in the URL.
 * By default if no query params are present in the URL, the search query is empty and the item types are COLLECTION and DATASET.
 * Every time a load of items is triggered, the pagination info is updated and the URL is updated with the new query params so it can be shared and the user can navigate back and forward in the browser.
 */

export const CollectionItemsPanel = ({
  collectionId,
  collectionRepository,
  collectionQueryParams,
  addDataSlot
}: CollectionItemsPanelProps) => {
  const { setIsLoading } = useLoading()
  const [_, setSearchParams] = useSearchParams()

  useLoadMoreOnPopStateEvent(loadItemsOnBackAndForwardNavigation)

  // This object will update every time we update a query param in the URL with the setSearchParams setter
  const currentSearchCriteria = new CollectionSearchCriteria(
    collectionQueryParams.searchQuery,
    collectionQueryParams.typesQuery || [CollectionItemType.COLLECTION, CollectionItemType.DATASET],
    collectionQueryParams.sortQuery,
    collectionQueryParams.orderQuery,
    collectionQueryParams.filtersQuery
  )

  const [paginationInfo, setPaginationInfo] = useState<CollectionItemsPaginationInfo>(
    new CollectionItemsPaginationInfo()
  )
  const itemsListContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    isLoadingItems,
    accumulatedItems,
    facets,
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

  async function handleLoadMoreOnBottomReach(currentPagination: CollectionItemsPaginationInfo) {
    let paginationInfoToSend = currentPagination
    if (totalAvailable !== undefined) {
      paginationInfoToSend = currentPagination.goToNextPage()
    }

    const totalItemsCount = await loadMore(paginationInfoToSend, currentSearchCriteria)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = paginationInfoToSend.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const handleSearchSubmit = async (searchValue: string) => {
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    // When searching, we reset the item types to COLLECTION, DATASET and FILE. Other filters are cleared
    setSearchParams((currentSearchParams) => {
      if (searchValue === '') {
        currentSearchParams.delete(CollectionItemsQueryParams.QUERY)
      } else {
        currentSearchParams.set(CollectionItemsQueryParams.QUERY, searchValue)
      }
      currentSearchParams.set(
        CollectionItemsQueryParams.TYPES,
        [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE].join(
          ','
        )
      )

      currentSearchParams.delete(CollectionItemsQueryParams.SORT)
      currentSearchParams.delete(CollectionItemsQueryParams.ORDER)
      currentSearchParams.delete(CollectionItemsQueryParams.FILTER_QUERIES)
      return currentSearchParams
    })

    // WHEN SEARCHING, WE RESET THE PAGINATION INFO AND KEEP ALL ITEM TYPES!!
    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      searchValue === '' ? undefined : searchValue,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE],
      undefined,
      undefined,
      undefined
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const handleItemsTypeChange = async (itemTypeChange: ItemTypeChange) => {
    const { type, checked } = itemTypeChange

    // These istanbul comments are only because checking if itemTypes is undefined is not possible is just a good defensive code to have
    const newItemsTypes = checked
      ? [...new Set([...(currentSearchCriteria?.itemTypes ?? /* istanbul ignore next */ []), type])]
      : (currentSearchCriteria.itemTypes ?? /* istanbul ignore next */ []).filter(
          (itemType) => itemType !== type
        )

    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    // Update the URL with the new item types, keep other querys
    setSearchParams((currentSearchParams) => {
      currentSearchParams.set(CollectionItemsQueryParams.TYPES, newItemsTypes.join(','))

      return currentSearchParams
    })

    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      currentSearchCriteria.searchText,
      newItemsTypes,
      currentSearchCriteria.sort,
      currentSearchCriteria.order,
      currentSearchCriteria.filterQueries
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const handleSortChange = async (sort?: SortType, order?: OrderType) => {
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    // Update the URL with the new sort and order, keep other querys
    setSearchParams((currentSearchParams) => {
      if (sort !== undefined) {
        currentSearchParams.set(CollectionItemsQueryParams.SORT, sort)
      } else {
        currentSearchParams.delete(CollectionItemsQueryParams.SORT)
      }

      if (order !== undefined) {
        currentSearchParams.set(CollectionItemsQueryParams.ORDER, order)
      } else {
        currentSearchParams.delete(CollectionItemsQueryParams.ORDER)
      }

      return currentSearchParams
    })

    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      currentSearchCriteria.searchText,
      currentSearchCriteria.itemTypes,
      sort,
      order,
      currentSearchCriteria.filterQueries
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const handleFacetChange = async (filterQuery: FilterQuery, removeOrAdd: RemoveAddFacetFilter) => {
    const newFilterQueries =
      removeOrAdd === RemoveAddFacetFilter.ADD
        ? [
            ...new Set([
              ...(currentSearchCriteria?.filterQueries ?? /* istanbul ignore next */ []),
              filterQuery
            ])
          ]
        : (currentSearchCriteria.filterQueries ?? /* istanbul ignore next */ []).filter(
            (fQuery) => fQuery !== filterQuery
          )

    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    const newFilterQueriesWithFacetValueEncoded = newFilterQueries.map((fq) => {
      const [facetName, facetValue] = fq.split(':')
      return `${facetName}:${encodeURIComponent(facetValue)}`
    })

    // Update the URL with the new facets, keep other querys and include the search value if exists
    setSearchParams((currentSearchParams) => {
      currentSearchParams.set(
        CollectionItemsQueryParams.FILTER_QUERIES,
        newFilterQueriesWithFacetValueEncoded.join(',')
      )

      return currentSearchParams
    })

    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      currentSearchCriteria.searchText,
      currentSearchCriteria.itemTypes,
      currentSearchCriteria.sort,
      currentSearchCriteria.order,
      newFilterQueries
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  async function loadItemsOnBackAndForwardNavigation() {
    const searchParams = new URLSearchParams(window.location.search)
    const collectionQueryParams = CollectionHelper.defineCollectionQueryParams(searchParams)

    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      collectionQueryParams.searchQuery,
      collectionQueryParams.typesQuery,
      collectionQueryParams.sortQuery,
      collectionQueryParams.orderQuery,
      collectionQueryParams.filtersQuery
    )

    const newPaginationInfo = new CollectionItemsPaginationInfo()
    const totalItemsCount = await loadMore(newPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = newPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const showSelectedFacets =
    currentSearchCriteria.filterQueries && currentSearchCriteria.filterQueries.length > 0

  useEffect(() => {
    setIsLoading(isLoadingItems)
  }, [isLoadingItems, setIsLoading])

  return (
    <section className={styles['items-panel']}>
      <header className={styles['top-wrapper']}>
        <SearchPanel
          onSubmitSearch={handleSearchSubmit}
          currentSearchValue={currentSearchCriteria.searchText}
          isLoadingCollectionItems={isLoadingItems}
        />
        <div className={styles['add-data-slot']}>{addDataSlot}</div>
      </header>

      <div className={styles['bottom-wrapper']}>
        <FilterPanel
          currentItemTypes={currentSearchCriteria.itemTypes}
          onItemTypesChange={handleItemsTypeChange}
          currentFilterQueries={currentSearchCriteria.filterQueries}
          facets={facets}
          onFacetChange={handleFacetChange}
          isLoadingCollectionItems={isLoadingItems}
        />

        <Stack direction="vertical" gap={2}>
          {showSelectedFacets && facets.length > 0 && (
            <SelectedFacets
              onRemoveFacet={(filterQuery: FilterQuery) =>
                handleFacetChange(filterQuery, RemoveAddFacetFilter.REMOVE)
              }
              selectedFilterQueries={currentSearchCriteria.filterQueries}
              isLoadingCollectionItems={isLoadingItems}
            />
          )}

          <ItemsList
            parentCollectionAlias={collectionId}
            items={accumulatedItems}
            error={error}
            accumulatedCount={accumulatedCount}
            isLoadingItems={isLoadingItems}
            areItemsAvailable={areItemsAvailable}
            hasNextPage={hasNextPage}
            isEmptyItems={isEmptyItems}
            hasSearchValue={currentSearchCriteria.hasSearchText()}
            itemsTypesSelected={currentSearchCriteria.itemTypes as CollectionItemType[]}
            filterQueriesSelected={currentSearchCriteria.filterQueries ?? []}
            sortSelected={currentSearchCriteria.sort}
            orderSelected={currentSearchCriteria.order}
            paginationInfo={paginationInfo}
            onBottomReach={handleLoadMoreOnBottomReach}
            onSortChange={handleSortChange}
            ref={itemsListContainerRef}
          />
        </Stack>
      </div>
    </section>
  )
}
