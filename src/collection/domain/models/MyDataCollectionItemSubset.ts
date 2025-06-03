import { CollectionItem, CountPerObjectType } from '@/collection/domain/models/CollectionItemSubset'
import { PublicationStatus } from '@/shared/core/domain/models/PublicationStatus'

export interface MyDataCollectionItemSubset {
  items: CollectionItem[]
  publicationStatusCounts: PublicationStatusCount[]
  totalItemCount: number
  countPerObjectType: CountPerObjectType
}

export interface PublicationStatusCount {
  publicationStatus: PublicationStatus
  count: number
}
