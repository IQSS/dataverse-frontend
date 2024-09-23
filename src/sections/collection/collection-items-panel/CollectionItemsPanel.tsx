import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '../../../collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionSearchCriteria } from '../../../collection/domain/models/CollectionSearchCriteria'
import { useGetAccumulatedItems } from './useGetAccumulatedItems'
import { UseCollectionQueryParamsReturnType } from '../useGetCollectionQueryParams'
import { useLoading } from '../../loading/LoadingContext'
import { FilterPanel } from './filter-panel/FilterPanel'
import { ItemsList } from './items-list/ItemsList'
import { SearchPanel } from './search-panel/SearchPanel'
import { QueryParamKey } from '../../Route.enum'
import { CollectionItemType } from '../../../collection/domain/models/CollectionItemType'
import { ItemTypeChange } from './filter-panel/type-filters/TypeFilters'
import styles from './CollectionItemsPanel.module.scss'

interface CollectionItemsPanelProps {
  collectionId: string
  collectionRepository: CollectionRepository
  collectionQueryParams: UseCollectionQueryParamsReturnType
  addDataSlot: JSX.Element | null
}

export const CollectionItemsPanel = ({
  collectionId,
  collectionRepository,
  collectionQueryParams,
  addDataSlot
}: CollectionItemsPanelProps) => {
  const { setIsLoading } = useLoading()
  const [_, setSearchParams] = useSearchParams()

  // This object will update every time we update a query param in the URL with the setSearchParams setter
  const currentSearchCriteria = new CollectionSearchCriteria(
    collectionQueryParams.searchQuery,
    collectionQueryParams.typesQuery || [CollectionItemType.COLLECTION, CollectionItemType.DATASET]
  )

  /*
    TODO:ME For now I think we really shouldnt care about setting an inital page based on the page query param
    Items in specific page of a list could change while browsing at different times so is not so useful for url sharing.
  */
  const [paginationInfo, setPaginationInfo] = useState<CollectionItemsPaginationInfo>(
    new CollectionItemsPaginationInfo()
  )
  const itemsListContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    isLoadingItems,
    accumulatedItems,
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

  // TODO:ME Detect with popstate event when the user goes back or forward in the browser history to perform the search again.
  /*
    Could be good to move it to a custom hook that receives the currentSearchCriteria and the loadMore function
    CurrentSearchCriteria will be outdated, due to change only when is set by setSearchParams
    Could be good to instead of calling load more, call the setSearchParams with the new search params but reading them with URLSearchParams
    And also create a reausable function that accepts searchParams from both useSearchParams and URLSearchParams
  */
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      console.log(currentSearchCriteria)
      console.log('Navegación hacia atrás o adelante detectada', event)
    }

    window.addEventListener('popstate', handlePopState)

    return () => {
      console.log('Removing popstate event listener')
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

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

    const resetedPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetedPaginationInfo)

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
        [QueryParamKey.COLLECTION_ITEM_TYPES]: [
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

    const totalItemsCount = await loadMore(resetedPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetedPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  // WHEN APPLYING FILTERS, WE RESET THE PAGINATION INFO AND IF SEARCH VALUE EXISTS, WE KEEP IT!!
  const handleItemsTypeChange = async (itemTypeChange: ItemTypeChange) => {
    const { type, checked } = itemTypeChange

    const newItemsTypes = checked
      ? [...new Set([...(currentSearchCriteria?.itemTypes ?? []), type])]
      : (currentSearchCriteria.itemTypes ?? []).filter((itemType) => itemType !== type)

    // KEEP SEARCH VALUE IF EXISTS
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetedPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetedPaginationInfo)

    // Update the URL with the new item types, keep other querys and include the search value if exists
    setSearchParams((currentSearchParams) => ({
      ...currentSearchParams,
      [QueryParamKey.COLLECTION_ITEM_TYPES]: newItemsTypes.join(','),
      ...(currentSearchCriteria.searchText && {
        [QueryParamKey.QUERY]: currentSearchCriteria.searchText
      })
    }))

    const newCollectionSearchCriteria = new CollectionSearchCriteria(
      currentSearchCriteria.searchText,
      newItemsTypes
    )

    const totalItemsCount = await loadMore(resetedPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetedPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  useEffect(() => {
    setIsLoading(isLoadingItems)
  }, [isLoadingItems, setIsLoading])

  return (
    <section className={styles['items-panel']}>
      <header className={styles['top-wrapper']}>
        <SearchPanel
          onSubmitSearch={handleSearchSubmit}
          initialSearchValue={currentSearchCriteria.searchText}
          isLoadingCollectionItems={isLoadingItems}
        />
        <div className={styles['add-data-slot']}>{addDataSlot}</div>
      </header>

      <div className={styles['bottom-wrapper']}>
        <FilterPanel
          currentItemTypes={currentSearchCriteria.itemTypes}
          onItemTypesChange={handleItemsTypeChange}
          isLoadingCollectionItems={isLoadingItems}
        />

        <ItemsList
          items={accumulatedItems}
          error={error}
          accumulatedCount={accumulatedCount}
          isLoadingItems={isLoadingItems}
          areItemsAvailable={areItemsAvailable}
          hasNextPage={hasNextPage}
          isEmptyItems={isEmptyItems}
          hasSearchValue={new CollectionSearchCriteria(
            collectionQueryParams.searchQuery
          ).hasSearchText()}
          paginationInfo={paginationInfo}
          onBottomReach={handleLoadMoreOnBottomReach}
          ref={itemsListContainerRef}
        />
      </div>
    </section>
  )
}
