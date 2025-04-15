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
  type?: FeaturedItemType.CUSTOM // Optional for now for demo purposes
  content: string
  image: File | string | null
}

export type DvObjectFeaturedItemField = {
  itemId?: CollectionFeaturedItem['id']
  type?: FeaturedItemType.COLLECTION | FeaturedItemType.DATASET | FeaturedItemType.FILE // Optional for now for demo purposes
  dvObjectId: string // The selected or default dv object id
  description?: string // The description of the dv object (optional in the form)
}

// This will be use the data of a form field when just adding it, then the user will select which type of featured item wants, custom or dvobject.
export type BaseFeaturedItemField = {
  itemId?: CollectionFeaturedItem['id']
  type?: 'base' // Optional for now for demo purposes
}
