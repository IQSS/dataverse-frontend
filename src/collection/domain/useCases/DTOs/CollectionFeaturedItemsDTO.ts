export enum FeaturedItemType {
  CUSTOM = 'custom',
  COLLECTION = 'collection',
  DATASET = 'dataset',
  FILE = 'file'
}

export type CollectionFeaturedItemsDTO = CollectionFeaturedItemDTO[]

export interface CollectionFeaturedItemDTO {
  id?: number
  type: FeaturedItemType.COLLECTION // this was added temporarily because the integration code is in another branch
  content: string
  displayOrder: number
  dvObjectIdentifier: string
  file?: File
  keepFile: boolean
}
