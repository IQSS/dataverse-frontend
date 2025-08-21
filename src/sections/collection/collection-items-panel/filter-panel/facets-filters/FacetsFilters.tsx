import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { Stack } from '@iqss/dataverse-design-system'
import { CollectionItemsFacet } from '@/collection/domain/models/CollectionItemSubset'
import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { FacetFilterGroup, RemoveAddFacetFilter } from './FacetFilterGroup'
import { CollectionHelper } from '@/sections/collection/CollectionHelper'
import styles from './FacetsFilters.module.scss'

interface FacetsFiltersProps {
  facets: CollectionItemsFacet[]
  currentFilterQueries?: FilterQuery[]
  onFacetChange: (filterQuery: FilterQuery, removeOrAdd: RemoveAddFacetFilter) => void
  isLoadingCollectionItems: boolean
}

export const FacetsFilters = ({
  facets,
  currentFilterQueries,
  onFacetChange,
  isLoadingCollectionItems
}: FacetsFiltersProps) => {
  if (isLoadingCollectionItems && facets.length === 0) {
    return <FacetsFiltersSkeleton />
  }

  return (
    <Stack gap={2} as="ul" className={styles['facets-list']}>
      {facets.map((facet) => {
        const facetSelectedLabels = currentFilterQueries
          ?.filter((query) => query.startsWith(`${facet.name}:`))
          .map((query) => {
            const keyAndValue = CollectionHelper.splitFilterQueryKeyAndValue(query)
            return keyAndValue?.filterQueryValue || /* istanbul ignore next */ 'Unknown' // Fallback if split fails
          })

        return (
          <FacetFilterGroup
            facet={facet}
            key={facet.name}
            facetSelectedLabels={facetSelectedLabels}
            onFacetChange={onFacetChange}
            isLoadingCollectionItems={isLoadingCollectionItems}
          />
        )
      })}
    </Stack>
  )
}

const FacetsFiltersSkeleton = () => (
  <SkeletonTheme>
    <div data-testid="facets-filters-skeleton">
      {Array.from({ length: 3 }).map((_, index) => (
        <div style={{ padding: '16px 0 8px 0' }} key={index}>
          <Skeleton height={18} width={160} style={{ marginBottom: 8 }} />

          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} height={14} width={120} />
          ))}
        </div>
      ))}
    </div>
  </SkeletonTheme>
)
