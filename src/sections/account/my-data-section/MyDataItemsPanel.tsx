import { useEffect, useRef, useState } from 'react'
import { Stack } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { useLoadMoreOnPopStateEvent } from '../../shared/collection-items-panel/useLoadMoreOnPopStateEvent'
import { useLoading } from '@/sections/loading/LoadingContext'
import { ItemsList } from '../../shared/collection-items-panel/items-list/ItemsList'
import { MyDataFilterPanel } from '@/sections/account/my-data-section/my-data-filter-panel/MyDataFilterPanel'
import { SearchPanel } from '../../shared/collection-items-panel/search-panel/SearchPanel'
import { ItemTypeChange } from '../../shared/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { MyDataSearchCriteria } from '@/sections/account/my-data-section/MyDataSearchCriteria'
import { useGetMyDataAccumulatedItems } from '@/sections/account/my-data-section/useGetMyDataAccumulatedItems'
import { RoleChange } from '@/sections/account/my-data-section/my-data-filter-panel/role-filters/RoleFilters'
import { AllPublicationStatuses } from '@/shared/core/domain/models/PublicationStatus'
import styles from './MyDataItemsPanel.module.scss'
import { PublicationStatusChange } from '@/sections/account/my-data-section/my-data-filter-panel/publication-status-filters/PublicationStatusFilters'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { CollectionSearchCriteria } from '@/collection/domain/models/CollectionSearchCriteria'

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
  // TODO: add roleIds from API
  const [userRoles] = useState([
    { roleId: 1, roleName: 'Admin' },
    { roleId: 6, roleName: 'Contributor' },
    { roleId: 7, roleName: 'Curator' }
  ])
  const roleIds = userRoles.map((role) => role.roleId)

  useLoadMoreOnPopStateEvent(loadItemsOnBackAndForwardNavigation)

  const [currentSearchCriteria, setCurrentSearchCriteria] = useState<MyDataSearchCriteria>(
    new MyDataSearchCriteria(
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE],
      roleIds,
      AllPublicationStatuses,
      undefined
    )
  )

  const [paginationInfo, setPaginationInfo] = useState<CollectionItemsPaginationInfo>(
    new CollectionItemsPaginationInfo()
  )
  const itemsListContainerRef = useRef<HTMLDivElement | null>(null)

  const {
    isLoadingItems,
    accumulatedItems,
    publicationStatusCounts,
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

  const handlePublicationStatusChange = async (
    publicationStatusChange: PublicationStatusChange
  ) => {
    const { publicationStatus, checked } = publicationStatusChange
    console.log('handlePublicationStatusChange', publicationStatus, checked)
    // These istanbul comments are only because checking if publicationStatuses is undefined is not possible is just a good defensive code to have
    const newPublicationStatuses = checked
      ? [
          ...new Set([
            ...(currentSearchCriteria?.publicationStatuses ?? /* istanbul ignore next */ []),
            publicationStatus
          ])
        ]
      : (currentSearchCriteria.publicationStatuses ?? /* istanbul ignore next */ []).filter(
          (status) => status !== publicationStatus
        )
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    const newMyDataSearchCriteria = new MyDataSearchCriteria(
      currentSearchCriteria.itemTypes,
      currentSearchCriteria.roleIds,
      newPublicationStatuses,
      currentSearchCriteria.searchText
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newMyDataSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
    setCurrentSearchCriteria(newMyDataSearchCriteria)
  }

  const handleSearchSubmit = async (searchValue: string) => {
    itemsListContainerRef.current?.scrollTo({ top: 0 })
    // WHEN SEARCHING, WE RESET THE PAGINATION INFO AND THE OTHER FILTERS
    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    const newCollectionSearchCriteria = new MyDataSearchCriteria(
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE],
      roleIds,
      AllPublicationStatuses,
      searchValue === '' ? undefined : searchValue
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
  }

  const handleItemsTypeChange = async (itemTypeChange: ItemTypeChange) => {
    const { type, checked } = itemTypeChange
    console.log('handleItemsTypeChange', type, checked)
    // These istanbul comments are only because checking if itemTypes is undefined is not possible is just a good defensive code to have
    const newItemsTypes = checked
      ? [...new Set([...(currentSearchCriteria?.itemTypes ?? /* istanbul ignore next */ []), type])]
      : (currentSearchCriteria.itemTypes ?? /* istanbul ignore next */ []).filter(
          (itemType) => itemType !== type
        )
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    const newMyDataSearchCriteria = new MyDataSearchCriteria(
      newItemsTypes,
      currentSearchCriteria.roleIds,
      currentSearchCriteria.publicationStatuses,
      currentSearchCriteria.searchText
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newMyDataSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
    setCurrentSearchCriteria(newMyDataSearchCriteria)
  }

  const handleRoleChange = async (roleChange: RoleChange) => {
    const { roleId, checked } = roleChange
    console.log('handleRoleChange', roleId, checked)
    // These istanbul comments are only because checking if itemTypes is undefined is not possible is just a good defensive code to have
    const newRoleIds = checked
      ? [...new Set([...(currentSearchCriteria?.roleIds ?? /* istanbul ignore next */ []), roleId])]
      : (currentSearchCriteria.roleIds ?? /* istanbul ignore next */ []).filter(
          (currentRoleId) => currentRoleId !== roleId
        )
    itemsListContainerRef.current?.scrollTo({ top: 0 })

    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    const newMyDataSearchCriteria = new MyDataSearchCriteria(
      currentSearchCriteria.itemTypes,
      newRoleIds,
      currentSearchCriteria.publicationStatuses,
      currentSearchCriteria.searchText
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newMyDataSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
    setCurrentSearchCriteria(newMyDataSearchCriteria)
  }

  async function loadItemsOnBackAndForwardNavigation() {
    const newPaginationInfo = new CollectionItemsPaginationInfo()
    // WHEN SEARCHING, WE RESET THE PAGINATION INFO AND KEEP ALL ITEM TYPES!!
    const newCollectionSearchCriteria = new MyDataSearchCriteria(
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE],
      roleIds,
      currentSearchCriteria.publicationStatuses,
      undefined
    )
    const totalItemsCount = await loadMore(newPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = newPaginationInfo.withTotal(totalItemsCount)
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
          currentSearchValue={currentSearchCriteria.searchText}
          isLoadingCollectionItems={isLoadingItems}
        />
      </header>

      <div className={styles['bottom-wrapper']}>
        <MyDataFilterPanel
          currentItemTypes={currentSearchCriteria.itemTypes}
          onItemTypesChange={handleItemsTypeChange}
          currentPublicationStatuses={currentSearchCriteria.publicationStatuses}
          publicationStatusCounts={publicationStatusCounts}
          onPublicationStatusesChange={handlePublicationStatusChange}
          currentRoleIds={currentSearchCriteria.roleIds}
          userRoles={userRoles}
          onRolesChange={handleRoleChange}
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
            filterQueriesSelected={
              currentSearchCriteria.publicationStatuses?.map(
                (status) => `publicationStatus:${status}` as `${string}:${string}`
              ) ?? []
            }
            paginationInfo={paginationInfo}
            onBottomReach={handleLoadMoreOnBottomReach}
            ref={itemsListContainerRef}
          />
        </Stack>
      </div>
    </section>
  )
}
