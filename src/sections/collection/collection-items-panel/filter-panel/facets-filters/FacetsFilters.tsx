import { Stack } from '@iqss/dataverse-design-system'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/GetCollectionItemsQueryParams'
import { FacetFilterGroup, RemoveAddFacetFilter } from './FacetFilter'
import styles from './FacetsFilters.module.scss'

interface FacetsFiltersProps {
  facets: CollectionItemsFacet[]
  currentFilterQueries?: FilterQuery[]
  onFacetChange: (filterQuery: FilterQuery, removeOrAdd: RemoveAddFacetFilter) => void
}

export const FacetsFilters = ({
  facets,
  currentFilterQueries,
  onFacetChange
}: FacetsFiltersProps) => {
  return (
    <Stack gap={2} as="ul" className={styles['facets-list']}>
      {facets.map((facet) => {
        const facetSelectedLabels = currentFilterQueries
          ?.filter((query) => query.split(':')[0] === facet.name)
          .map((query) => query.split(':')[1])

        return (
          <FacetFilterGroup
            facet={facet}
            key={facet.name}
            facetSelectedLabels={facetSelectedLabels}
            onFacetChange={onFacetChange}
          />
        )
      })}
    </Stack>
  )
}
