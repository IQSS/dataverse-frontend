export type CollectionFeaturedItem = CustomFeaturedItem | DvObjectFeaturedItem

export type CustomFeaturedItem = {
  id: number
  type?: FeaturedItemType.CUSTOM // Optional for now for demo purposes
  content: string
  imageFileName?: string
  imageFileUrl?: string
  displayOrder: number
}

export type DvObjectFeaturedItem = {
  id: number // The id of the featured item
  dvObjectId: string // The dataverse object id
  type?: FeaturedItemType.COLLECTION | FeaturedItemType.DATASET | FeaturedItemType.FILE // Optional for now for demo purposes
  description?: string // Optional for now for demo purposes
  displayOrder: number
}

export enum FeaturedItemType {
  CUSTOM = 'custom',
  COLLECTION = 'collection',
  DATASET = 'dataset',
  FILE = 'file'
}
