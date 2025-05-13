import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Offcanvas } from '@iqss/dataverse-design-system'
import { FunnelFill } from 'react-bootstrap-icons'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { Role } from '@/users/domain/models/Role'
import { ItemTypeChange } from '@/sections/collection/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { PublicationStatusChange } from '@/sections/account/my-data-section/my-data-filter-panel/publication-status-filters/PublicationStatusFilters'
import { RoleChange } from '@/sections/account/my-data-section/my-data-filter-panel/role-filters/RoleFilters'
import { TypeFilters } from '@/sections/collection/collection-items-panel/filter-panel/type-filters/TypeFilters'
import { RoleFilters } from '@/sections/account/my-data-section/my-data-filter-panel/role-filters/RoleFilters'
import {
  PublicationStatusCount,
  PublicationStatusFilters
} from '@/sections/account/my-data-section/my-data-filter-panel/publication-status-filters/PublicationStatusFilters'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'
import styles from './MyDataFilterPanel.module.scss'

interface FilterPanelProps {
  currentItemTypes?: CollectionItemType[]
  onItemTypesChange: (itemTypeChange: ItemTypeChange) => void
  currentPublicationStatuses: PublicationStatus[]
  publicationStatusCounts: PublicationStatusCount[]
  onPublicationStatusesChange: (publicationStatusChange: PublicationStatusChange) => void
  userRoles: Role[]
  currentRoleIds: number[]
  onRolesChange: (roleChange: RoleChange) => void
  isLoadingCollectionItems: boolean
}

export const MyDataFilterPanel = ({
  currentItemTypes,
  onItemTypesChange,
  currentPublicationStatuses,
  publicationStatusCounts,
  onPublicationStatusesChange,
  userRoles,
  currentRoleIds,
  onRolesChange,
  isLoadingCollectionItems
}: FilterPanelProps) => {
  const { t } = useTranslation('collection')

  const [showOffcanvas, setShowOffcanvas] = useState(false)

  const handleCloseOffcanvas = () => setShowOffcanvas(false)
  const handleShowOffcanvas = () => setShowOffcanvas(true)

  return (
    <div className={styles['filter-panel']}>
      <Button
        variant="primary"
        className={styles['toggle-canvas-btn']}
        onClick={handleShowOffcanvas}
        size="sm">
        <FunnelFill /> {t('filterResults')}
      </Button>

      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{t('filterResults')}</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body dataTestId="filter-panel-off-canvas-body">
          <div className={styles['filters-wrapper']}>
            <TypeFilters
              onItemTypesChange={onItemTypesChange}
              currentItemTypes={currentItemTypes}
              isLoadingCollectionItems={isLoadingCollectionItems}
            />

            <PublicationStatusFilters
              currentPublicationStatuses={currentPublicationStatuses}
              publicationStatusCounts={publicationStatusCounts}
              onPublicationStatusChange={onPublicationStatusesChange}
              isLoadingCollectionItems={isLoadingCollectionItems}
            />

            <RoleFilters
              currentRoleIds={currentRoleIds}
              userRoles={userRoles}
              onRolesChange={onRolesChange}
              isLoadingCollectionItems={isLoadingCollectionItems}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}
