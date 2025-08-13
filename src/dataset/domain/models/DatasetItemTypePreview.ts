import { CollectionItemType } from '../../../collection/domain/models/CollectionItemType'
import { PublicationStatus } from '../../../shared/core/domain/models/PublicationStatus'
import { DatasetVersion } from './Dataset'

export interface DatasetItemTypePreview {
  type: CollectionItemType.DATASET
  persistentId: string
  version: DatasetVersion
  releaseOrCreateDate: Date
  description: string
  thumbnail?: string
  publicationStatuses: PublicationStatus[]
  parentCollectionName: string
  parentCollectionAlias: string
  userRoles?: string[]
}
