import { CollectionItemType } from './CollectionItemType'

export interface CollectionItemTypePreview {
  type: CollectionItemType.COLLECTION
  isReleased: boolean
  name: string
  alias: string
  description?: string
  affiliation?: string
  releaseOrCreateDate: Date
  thumbnail?: string
  parentCollectionName: string
  parentCollectionAlias: string
}
