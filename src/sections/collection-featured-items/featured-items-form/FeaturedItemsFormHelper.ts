import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemsFormData } from '../types'

export class FeaturedItemsFormHelper {
  static defineDefaultFeaturedItems(
    collectionFeaturedItems: CollectionFeaturedItem[]
  ): FeaturedItemsFormData['featuredItems'] {
    if (!collectionFeaturedItems.length) {
      return [
        {
          title: '',
          content: '',
          image: undefined
        }
      ]
    }

    return collectionFeaturedItems.map((collectionFeaturedItem) => {
      const { id, title, content, imageUrl } = collectionFeaturedItem

      return {
        title,
        content,
        image: imageUrl,
        itemId: id
      }
    })
  }
}
