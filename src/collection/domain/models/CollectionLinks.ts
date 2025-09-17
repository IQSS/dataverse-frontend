import { DatasetSummary } from '@/dataset/domain/models/DatasetSummary'
import { CollectionSummary } from './CollectionSummary'

export interface CollectionLinks {
  linkedCollections: CollectionSummary[]
  collectionsLinkingToThis: CollectionSummary[]
  linkedDatasets: DatasetSummary[]
}
