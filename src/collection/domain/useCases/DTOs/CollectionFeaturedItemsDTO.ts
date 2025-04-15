export type CollectionFeaturedItemsDTO = CollectionFeaturedItemDTO[]

export type CollectionFeaturedItemDTO =
  | CollectionCustomFeaturedItemDTO
  | CollectionDvObjectFeaturedItemDTO

export interface CollectionCustomFeaturedItemDTO {
  id?: number
  content: string
  displayOrder: number
  file?: File
  keepFile: boolean
}

export interface CollectionDvObjectFeaturedItemDTO {
  id?: number
  dvObjectId: string
  description?: string
  displayOrder: number
}
