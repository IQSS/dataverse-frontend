import { useTranslation } from 'react-i18next'
import { Button } from '@iqss/dataverse-design-system'
import { X as CloseIcon } from 'react-bootstrap-icons'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { CollectionHelper } from '../../CollectionHelper'
import styles from './SelectedFacets.module.scss'

interface SelectedFacetsProps {
  facets?: CollectionItemsFacet[]
  selectedFilterQueries: FilterQuery[]
  onRemoveFacet: (filterQuery: FilterQuery) => void
  isLoadingCollectionItems: boolean
}

export const SelectedFacets = ({
  facets = [],
  selectedFilterQueries,
  onRemoveFacet,
  isLoadingCollectionItems
}: SelectedFacetsProps) => {
  const { t } = useTranslation('collection')

  const getFacetLabel = (filterQuery: FilterQuery): string => {
    const keyAndValue = CollectionHelper.splitFilterQueryKeyAndValue(filterQuery)
    if (!keyAndValue) {
      return 'Unknown'
    }

    const { filterQueryKey, filterQueryValue } = keyAndValue
    const matchingFacet = facets.find((facet) => facet.name === filterQueryKey)
    const facetName = matchingFacet ? matchingFacet.friendlyName : filterQueryKey

    return `${facetName}: ${filterQueryValue}`
  }

  return (
    <div className={styles['selected-facets-container']}>
      {selectedFilterQueries.map((filterQuery) => {
        const labelName = getFacetLabel(filterQuery)

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
