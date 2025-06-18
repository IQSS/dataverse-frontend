export type FeaturedItem = CustomFeaturedItem | DvObjectFeaturedItem

export type CustomFeaturedItem = {
  id: number
  type: FeaturedItemType.CUSTOM
  content: string
  imageFileName?: string
  imageFileUrl?: string
  displayOrder: number
}

export type DvObjectFeaturedItem = {
  id: number
  type: FeaturedItemType.COLLECTION | FeaturedItemType.DATASET | FeaturedItemType.FILE
  dvObjectIdentifier: string
  dvObjectDisplayName: string
  displayOrder: number
}

export enum FeaturedItemType {
  CUSTOM = 'custom',
  COLLECTION = 'collection',
  DATASET = 'dataset',
  FILE = 'file'
}
