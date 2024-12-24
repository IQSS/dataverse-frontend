export type CollectionFeaturedItemsDTO = CollectionFeaturedItemDTO[]

export interface CollectionFeaturedItemDTO {
  content: string
  order: number
  file?: File
  keepFile: boolean
  id?: string
}
