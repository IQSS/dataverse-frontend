import { useEffect, useRef, useState } from 'react'
import { Stack } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { useLoadMoreOnPopStateEvent } from '../../shared/collection-items-panel/useLoadMoreOnPopStateEvent'
import { useLoading } from '@/sections/loading/LoadingContext'
import { FilterPanel } from '../../shared/collection-items-panel/filter-panel/FilterPanel'
import { ItemsList } from '../../shared/collection-items-panel/items-list/ItemsList'
import { SearchPanel } from '../../shared/collection-items-panel/search-panel/SearchPanel'
import { ItemTypeChange } from '../../shared/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { RemoveAddFacetFilter } from '../../shared/collection-items-panel/filter-panel/facets-filters/FacetFilterGroup'
import styles from './MyDataItemsPanel.module.scss'
import { MyDataSearchCriteria } from '@/sections/account/my-data-section/MyDataSearchCriteria'
import { useGetMyDataAccumulatedItems } from '@/sections/account/my-data-section/useGetMyDataAccumulatedItems'

interface MyDataItemsPanelProps {
  collectionRepository: CollectionRepository
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
 */

export const MyDataItemsPanel = ({ collectionRepository }: MyDataItemsPanelProps) => {
  const { setIsLoading } = useLoading()

  useLoadMoreOnPopStateEvent(loadItemsOnBackAndForwardNavigation)

  // This object will update every time we update a query param in the URL with the setSearchParams setter
  // TODO: define Publishing list elsewhere
  const currentSearchCriteria = new MyDataSearchCriteria(
    [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE],
    undefined,
    undefined
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
  } = useGetMyDataAccumulatedItems({
    collectionRepository
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
  const handleFacetChange = async (
    filterQuery: FilterQuery,
    removeAddFacetFilter: RemoveAddFacetFilter
  ) => {}
  const handleSearchSubmit = async (searchValue: string) => {}

  const handleItemsTypeChange = async (itemTypeChange: ItemTypeChange) => {}

  async function loadItemsOnBackAndForwardNavigation() {
    const newPaginationInfo = new CollectionItemsPaginationInfo()
    // WHEN SEARCHING, WE RESET THE PAGINATION INFO AND KEEP ALL ITEM TYPES!!
    const newCollectionSearchCriteria = new MyDataSearchCriteria(
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE],
      undefined,
      undefined
    )
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
      </header>

      <div className={styles['bottom-wrapper']}>
        <FilterPanel
          currentItemTypes={currentSearchCriteria.itemTypes}
          onItemTypesChange={handleItemsTypeChange}
          facets={facets}
          onFacetChange={handleFacetChange}
          isLoadingCollectionItems={isLoadingItems}
        />

        <Stack direction="vertical" gap={2}>
          <ItemsList
            items={accumulatedItems}
            error={error}
            accumulatedCount={accumulatedCount}
            isLoadingItems={isLoadingItems}
            areItemsAvailable={areItemsAvailable}
            hasNextPage={hasNextPage}
            isEmptyItems={isEmptyItems}
            hasSearchValue={currentSearchCriteria.hasSearchText()}
            itemsTypesSelected={currentSearchCriteria.itemTypes}
            filterQueriesSelected={currentSearchCriteria.filterQueries ?? []}
            paginationInfo={paginationInfo}
            onBottomReach={handleLoadMoreOnBottomReach}
            ref={itemsListContainerRef}
          />
        </Stack>
      </div>
    </section>
  )
}
