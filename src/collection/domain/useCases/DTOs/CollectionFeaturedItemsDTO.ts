export type CollectionFeaturedItemsDTO = CollectionFeaturedItemDTO[]

export interface CollectionFeaturedItemDTO {
  id?: number
  content: string
  displayOrder: number
  file?: File
  keepFile: boolean
}
