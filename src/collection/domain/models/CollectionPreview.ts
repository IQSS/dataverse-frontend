// TODO:ME Once 181 is merged, update interface

export interface CollectionPreview {
  id: string
  name: string
  isReleased: boolean
  releaseOrCreateDate: Date
  parentCollectionId?: string
  parentCollectionName?: string
  description?: string
  affiliation?: string
  thumbnail?: string
}
