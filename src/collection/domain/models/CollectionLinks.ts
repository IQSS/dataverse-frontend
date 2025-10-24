import { CollectionSummary } from './CollectionSummary'

export interface CollectionLinks {
  linkedCollections: CollectionSummary[]
  collectionsLinkingToThis: CollectionSummary[]
  linkedDatasets: { persistentId: string; title: string }[]
}
