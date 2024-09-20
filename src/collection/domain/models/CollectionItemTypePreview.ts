import { CollectionItemType } from './CollectionItemType'

export interface CollectionItemTypePreview {
  type: CollectionItemType.COLLECTION
  isReleased: boolean
  name: string
  alias: string
  description?: string // it could be undefined before ?
  affiliation?: string // it could be undefined before ?
  releaseOrCreateDate: Date
  thumbnail?: string
  parentCollectionName: string
  parentCollectionAlias: string
}
