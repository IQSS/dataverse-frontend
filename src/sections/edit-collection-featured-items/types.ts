import { FeaturedItem, FeaturedItemType } from '@/collection/domain/models/FeaturedItem'

export type FeaturedItemsFormData = {
  featuredItems: FeaturedItemField[]
}

export type FeaturedItemField =
  | CustomFeaturedItemField
  | DvObjectFeaturedItemField
  | BaseFeaturedItemField

export type FeaturedItemFieldWithSortId = FeaturedItemField & {
  id: string
}

export type CustomFeaturedItemField = {
  itemId?: FeaturedItem['id']
  type: FeaturedItemType.CUSTOM
  content: string
  image: File | string | null
}

export type DvObjectFeaturedItemField = {
  itemId?: FeaturedItem['id']
  type: FeaturedItemType.COLLECTION | FeaturedItemType.DATASET | FeaturedItemType.FILE | ''
  dvObjectIdentifier: string
  dvObjectUrl: string
}

// This will be the data of a form field when just adding it, then the user will select which type of featured item wants, custom or dvObject.
export type BaseFeaturedItemField = {
  itemId?: FeaturedItem['id']
  type: 'base'
}
