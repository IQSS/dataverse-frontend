import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, Offcanvas } from '@iqss/dataverse-design-system'
import { FunnelFill } from 'react-bootstrap-icons'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { ItemTypeChange, TypeFilters } from './type-filters/TypeFilters'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { FacetsFilters } from './facets-filters/FacetsFilters'
import { RemoveAddFacetFilter } from './facets-filters/FacetFilterGroup'
import styles from './FilterPanel.module.scss'

interface FilterPanelProps {
  currentItemTypes?: CollectionItemType[]
  onItemTypesChange: (itemTypeChange: ItemTypeChange) => void
  facets: CollectionItemsFacet[]
  currentFilterQueries?: FilterQuery[]
  onFacetChange: (filterQuery: FilterQuery, removeOrAdd: RemoveAddFacetFilter) => void
  isLoadingCollectionItems: boolean
}

export const FilterPanel = ({
  currentItemTypes,
  onItemTypesChange,
  facets,
  currentFilterQueries,
  onFacetChange,
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

            <FacetsFilters
              facets={facets}
              currentFilterQueries={currentFilterQueries}
              onFacetChange={onFacetChange}
              isLoadingCollectionItems={isLoadingCollectionItems}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  )
}
