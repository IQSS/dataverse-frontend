import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemsFormData } from '../types'

export class FeaturedItemsFormHelper {
  static defineDefaultFeaturedItems(
    collectionFeaturedItems: CollectionFeaturedItem[]
  ): FeaturedItemsFormData['featuredItems'] {
    if (!collectionFeaturedItems.length) {
      return [
        {
          content: '',
          image: null
        }
      ]
    }

    return collectionFeaturedItems.map((collectionFeaturedItem) => {
      const { id, content, imageUrl } = collectionFeaturedItem

      return {
        content,
        image: imageUrl ? imageUrl : null,
        itemId: id
      }
    })
  }
}
