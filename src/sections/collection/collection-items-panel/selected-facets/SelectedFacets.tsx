import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionHelper } from '../../CollectionHelper'
import styles from './SelectedFacets.module.scss'

interface SelectedFacetsProps {
  selectedFilterQueries: FilterQuery[]
  onRemoveFacet: (filterQuery: FilterQuery) => void
  isLoadingCollectionItems: boolean
}

export const SelectedFacets = ({
  selectedFilterQueries,
  onRemoveFacet,
  isLoadingCollectionItems
}: SelectedFacetsProps) => {
  const { t } = useTranslation('collection')

  return (
    <div className={styles['selected-facets-container']}>
      {selectedFilterQueries.map((filterQuery) => {
        const keyAndValue = CollectionHelper.splitFilterQueryKeyAndValue(filterQuery)

        const labelName = keyAndValue?.filterQueryValue || 'Unknown' // Fallback if split fails

        return (
          <Button
            size="sm"
            className={styles['selected-facet-btn']}
            onClick={() => onRemoveFacet(filterQuery)}
            disabled={isLoadingCollectionItems}
            aria-label={t('removeSelectedFacet', { labelName })}
            key={filterQuery}>
            {labelName} <CloseIcon size={22} />
          </Button>
        )
      })}
    </div>
  )
}
