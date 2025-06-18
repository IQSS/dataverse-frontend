import { CustomFeaturedItem, DvObjectFeaturedItem } from '../../models/FeaturedItem'

export type CollectionFeaturedItemsDTO = (CustomFeaturedItemDTO | DvObjectFeaturedItemDTO)[]

export interface CustomFeaturedItemDTO {
  id?: number
  type: CustomFeaturedItem['type']
  content: string
  displayOrder: number
  file?: File
  keepFile: boolean
}

export interface DvObjectFeaturedItemDTO {
  id?: number
  type: DvObjectFeaturedItem['type']
  dvObjectIdentifier: string
  displayOrder: number
}
