import {
  CollectionFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'

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
  itemId?: CollectionFeaturedItem['id']
  type: FeaturedItemType.CUSTOM
  content: string
  image: File | string | null
}

export type DvObjectFeaturedItemField = {
  itemId?: CollectionFeaturedItem['id']
  type: FeaturedItemType.COLLECTION | FeaturedItemType.DATASET | FeaturedItemType.FILE
  dvObjectIdentifier: string
}

// This will be the data of a form field when just adding it, then the user will select which type of featured item wants, custom or dvObject.
export type BaseFeaturedItemField = {
  itemId?: CollectionFeaturedItem['id']
  type: 'base'
}
