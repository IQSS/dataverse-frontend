import { useState } from 'react'
import { Button, Offcanvas } from '@iqss/dataverse-design-system'
import { FunnelFill } from 'react-bootstrap-icons'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { ItemTypeChange, TypeFilters } from './type-filters/TypeFilters'
import styles from './FilterPanel.module.scss'

interface FilterPanelProps {
  currentItemTypes?: CollectionItemType[]
  onItemTypesChange: (itemTypeChange: ItemTypeChange) => void
  isLoadingCollectionItems: boolean
}

export const FilterPanel = ({
  currentItemTypes,
  onItemTypesChange,
  isLoadingCollectionItems
}: FilterPanelProps) => {
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
        <FunnelFill /> Filter Results
      </Button>

      <Offcanvas show={showOffcanvas} onHide={handleCloseOffcanvas} responsive="lg">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Filter Results</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body dataTestId="filter-panel-off-canvas-body">
          <div className={styles['filters-wrapper']}>
            <TypeFilters
              onItemTypesChange={onItemTypesChange}
              currentItemTypes={currentItemTypes}
              isLoadingCollectionItems={isLoadingCollectionItems}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}
