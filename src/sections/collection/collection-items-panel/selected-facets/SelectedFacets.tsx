import { Button } from '@iqss/dataverse-design-system'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { FilterQuery } from '@/collection/domain/models/GetCollectionItemsQueryParams'
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
  return (
    <div className={styles['selected-facets-container']}>
      {selectedFilterQueries.map((filterQuery) => {
        const [_facetName, labelName] = filterQuery.split(':')

        return (
          <Button
            size="sm"
            className={styles['selected-facet-btn']}
            onClick={() => onRemoveFacet(filterQuery)}
            disabled={isLoadingCollectionItems}
            aria-label={`Remove ${labelName} query filter`}
            key={filterQuery}>
            {labelName} <CloseIcon size={22} />
          </Button>
        )
      })}
    </div>
  )
}
