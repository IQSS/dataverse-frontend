import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'

export type FeaturedItemsFormData = {
  featuredItems: FeaturedItemField[]
}

export type FeaturedItemField = {
  title: string
  content: string
  image: File | string | null
  itemId?: CollectionFeaturedItem['id']
}

export type FeaturedItemFieldWithSortId = FeaturedItemField & {
  id: string
}
