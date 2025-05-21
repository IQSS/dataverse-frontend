import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Stack } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionItemsPaginationInfo } from '@/collection/domain/models/CollectionItemsPaginationInfo'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { useLoading } from '@/sections/loading/LoadingContext'
import {
  ItemsList,
  ItemsListType
} from '@/sections/collection/collection-items-panel/items-list/ItemsList'
import { MyDataFilterPanel } from '@/sections/account/my-data-section/my-data-filter-panel/MyDataFilterPanel'
import { SearchPanel } from '@/sections/collection/collection-items-panel/search-panel/SearchPanel'
import { ItemTypeChange } from '@/sections/collection/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { MyDataSearchCriteria } from '@/sections/account/my-data-section/MyDataSearchCriteria'
import { useGetMyDataAccumulatedItems } from '@/sections/account/my-data-section/useGetMyDataAccumulatedItems'
import { RoleChange } from '@/sections/account/my-data-section/my-data-filter-panel/role-filters/RoleFilters'
import { AllPublicationStatuses } from '@/shared/core/domain/models/PublicationStatus'
import styles from './MyDataItemsPanel.module.scss'
import { PublicationStatusChange } from '@/sections/account/my-data-section/my-data-filter-panel/publication-status-filters/PublicationStatusFilters'
import accountStyles from '@/sections/account/Account.module.scss'
import { useSession } from '@/sections/session/SessionContext'
import { UserNameSearch } from '@/sections/account/my-data-section/user-name-filter/UserNameSearch'

interface MyDataItemsPanelProps {
  collectionRepository: CollectionRepository
}

/**
 * HOW IT WORKS:
 * This component loads items on the following scenarios:
 * 1. When the component mounts
 * 2. When the user scrolls to the bottom of the list and there are more items to load
 * 3. When the user submits a search query in the search panel
 * 4. When the user changes the item types, roles or publication statuses in the filter panel
 */

export const MyDataItemsPanel = ({ collectionRepository }: MyDataItemsPanelProps) => {
  const { setIsLoading } = useLoading()
  const { user } = useSession()
  const { t } = useTranslation('account')

  const [userRoles] = useState([
    { roleId: 1, roleName: 'Admin' },
    { roleId: 2, roleName: 'File Downloader' },
    { roleId: 3, roleName: 'Dataverse + Dataset Creator' },
    { roleId: 4, roleName: 'Dataverse Creator' },
    { roleId: 5, roleName: 'Dataset Creator' },
    { roleId: 6, roleName: 'Contributor' },
    { roleId: 7, roleName: 'Curator' },
    { roleId: 8, roleName: 'Member' }
  ])
  const roleIds = userRoles.map((role) => role.roleId)

  const [currentSearchCriteria, setCurrentSearchCriteria] = useState<MyDataSearchCriteria>(
    new MyDataSearchCriteria(
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET],
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
      currentSearchCriteria.searchText,
      currentSearchCriteria.otherUserName
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
    setCurrentSearchCriteria(newCollectionSearchCriteria)
  }

  const handleUserNameSearchSubmit = async (otherUserName: string) => {
    itemsListContainerRef.current?.scrollTo({ top: 0 })
    const resetPaginationInfo = new CollectionItemsPaginationInfo()
    setPaginationInfo(resetPaginationInfo)

    const newCollectionSearchCriteria = new MyDataSearchCriteria(
      currentSearchCriteria.itemTypes,
      currentSearchCriteria.roleIds,
      currentSearchCriteria.publicationStatuses,
      currentSearchCriteria.searchText,
      otherUserName === '' ? undefined : otherUserName
    )

    const totalItemsCount = await loadMore(resetPaginationInfo, newCollectionSearchCriteria, true)

    if (totalItemsCount !== undefined) {
      const paginationInfoUpdated = resetPaginationInfo.withTotal(totalItemsCount)
      setPaginationInfo(paginationInfoUpdated)
    }
    setCurrentSearchCriteria(newCollectionSearchCriteria)
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

  useEffect(() => {
    setIsLoading(isLoadingItems)
  }, [isLoadingItems, setIsLoading])

  return (
    <>
      <p className={accountStyles['helper-text']}>{t('myData.description')}</p>
      <section className={styles['items-panel']}>
        <header className={styles['top-wrapper']}>
          <SearchPanel
            onSubmitSearch={handleSearchSubmit}
            currentSearchValue={currentSearchCriteria.searchText}
            isLoadingCollectionItems={isLoadingItems}
            placeholderText={t('myData.searchThisCollectionPlaceholder')}
          />
          {user?.superuser && (
            <UserNameSearch
              isLoadingCollectionItems={isLoadingItems}
              onSubmitSearch={handleUserNameSearchSubmit}
            />
          )}
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
              itemsListType={ItemsListType.MY_DATA_LIST}
              error={error}
              accumulatedCount={accumulatedCount}
              isLoadingItems={isLoadingItems}
              areItemsAvailable={areItemsAvailable}
              hasNextPage={hasNextPage}
              isEmptyItems={isEmptyItems}
              hasSearchValue={currentSearchCriteria.hasSearchText()}
              itemsTypesSelected={currentSearchCriteria.itemTypes}
              hasFilterQueries={
                currentSearchCriteria.publicationStatuses.length != AllPublicationStatuses.length ||
                currentSearchCriteria.roleIds.length != userRoles.length
              }
              paginationInfo={paginationInfo}
              onBottomReach={handleLoadMoreOnBottomReach}
              ref={itemsListContainerRef}
              otherUserName={currentSearchCriteria.otherUserName}
            />
          </Stack>
        </div>
      </section>
    </>
  )
}
