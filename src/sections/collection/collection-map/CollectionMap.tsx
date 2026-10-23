import { FilterQuery } from '@/collection/domain/models/CollectionSearchCriteria'
import { DatasetsMap } from '@iqss/dataverse-design-system'
import { useCollectionMapData } from './useCollectionMapData'

export interface CollectionMapProps {
  collectionId: string
  searchText?: string
  filterQueries?: FilterQuery[]
  isVisible: boolean
}

export function CollectionMap({
  collectionId,
  searchText,
  filterQueries,
  isVisible
}: CollectionMapProps) {
  const mapData = useCollectionMapData(collectionId, searchText, filterQueries)
  return <DatasetsMap isVisible={isVisible} {...mapData} />
}
