import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionSearchCriteria } from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import {
  FilterQuery,
  GetCollectionItemsQueryParams
} from '@/collection/domain/models/GetCollectionItemsQueryParams'
import { useGetAccumulatedItems } from './useGetAccumulatedItems'
import { UseCollectionQueryParamsReturnType } from '../useGetCollectionQueryParams'
import { useLoadMoreOnPopStateEvent } from './useLoadMoreOnPopStateEvent'
import { useLoading } from '@/sections/loading/LoadingContext'
import { QueryParamKey } from '../../Route.enum'
import { CollectionHelper } from '../CollectionHelper'
import { FilterPanel } from './filter-panel/FilterPanel'
import { ItemsList } from './items-list/ItemsList'
import { SearchPanel } from './search-panel/SearchPanel'
import { ItemTypeChange } from './filter-panel/type-filters/TypeFilters'
import { RemoveAddFacetFilter } from './filter-panel/facets-filters/FacetFilter'
import { SelectedFacets } from './selected-facets/SelectedFacets'
import styles from './CollectionItemsPanel.module.scss'

interface CollectionItemsPanelProps {
  collectionId: string
  collectionRepository: CollectionRepository
  collectionQueryParams: UseCollectionQueryParamsReturnType
  addDataSlot: JSX.Element | null
}

/**
 * HOW IT WORKS:
 * This component loads items on 5 different scenarios:
 * 1. When the component mounts
 * 2. When the user scrolls to the bottom of the list and there are more items to load
 * 3. When the user submits a search query in the search panel
 * 4. When the user changes the item types in the filter panel
 * 5. When the user navigates back and forward in the browser
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
    undefined,
    undefined,
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

    if (searchValue === '') {
      // Update the URL without the search value, keep other querys
      setSearchParams((currentSearchParams) => {
        currentSearchParams.delete(QueryParamKey.QUERY)
        return currentSearchParams
      })
    } else {
      // Update the URL with the search value ,keep other querys and include all item types always
      setSearchParams((currentSearchParams) => ({
        ...currentSearchParams,
        [GetCollectionItemsQueryParams.TYPES]: [
          CollectionItemType.COLLECTION,
          CollectionItemType.DATASET,
          CollectionItemType.FILE
        ].join(','),
        [QueryParamKey.QUERY]: searchValue
      }))
    }

    // WHEN SEARCHING, WE RESET THE PAGINATION INFO AND KEEP ALL ITEM TYPES!!
    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      searchValue === '' ? undefined : searchValue,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE]
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

    // KEEP SEARCH VALUE IF EXISTS
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    // Update the URL with the new item types, keep other querys and include the search value if exists
    setSearchParams((currentSearchParams) => ({
      ...currentSearchParams,
      [GetCollectionItemsQueryParams.TYPES]: newItemsTypes.join(','),
      ...(currentSearchCriteria.searchText && {
        [QueryParamKey.QUERY]: currentSearchCriteria.searchText
      })
    }))

    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      currentSearchCriteria.searchText,
      newItemsTypes
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

    // Update the URL with the new item types, keep other querys and include the search value if exists
    setSearchParams((currentSearchParams) => ({
      ...currentSearchParams,
      ...(newFilterQueries.length > 0 && {
        [GetCollectionItemsQueryParams.FILTER_QUERIES]: newFilterQueries.join(',')
      }),
      ...(currentSearchCriteria.searchText && {
        [QueryParamKey.QUERY]: currentSearchCriteria.searchText
      })
    }))

    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      currentSearchCriteria.searchText,
      currentSearchCriteria.itemTypes,
      undefined,
      undefined,
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
      undefined,
      undefined,
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

        <div>
          {showSelectedFacets && facets.length > 0 && (
            <SelectedFacets
              onRemoveFacet={(filterQuery: FilterQuery) =>
                handleFacetChange(filterQuery, RemoveAddFacetFilter.REMOVE)
              }
              selectedFilterQueries={currentSearchCriteria.filterQueries}
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
            paginationInfo={paginationInfo}
            onBottomReach={handleLoadMoreOnBottomReach}
            ref={itemsListContainerRef}
          />
        </div>
      </div>
    </section>
  )
}
