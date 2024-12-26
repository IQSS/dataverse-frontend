import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemField, FeaturedItemsFormData } from '../types'
import {
  CollectionFeaturedItemDTO,
  CollectionFeaturedItemsDTO
} from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'

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

  static transformFormFieldsToFeaturedItems(
    featureItemFieldValues: FeaturedItemField[]
  ): CollectionFeaturedItem[] {
    return featureItemFieldValues.map((field, index) => {
      const { content, image, itemId } = field

      const currentFeaturedItem: CollectionFeaturedItem = {
        id: itemId ?? window.crypto.randomUUID(),
        type: 'custom',
        order: index,
        content
      }

      if (image && image instanceof File) {
        const objectUrl = URL.createObjectURL(image)

        currentFeaturedItem.imageUrl = objectUrl
      }

      if (image && typeof image === 'string') {
        currentFeaturedItem.imageUrl = image
      }

      return currentFeaturedItem
    })
  }

  static defineFeaturedItemsDTO(
    formFeaturedItems: FeaturedItemsFormData['featuredItems']
  ): CollectionFeaturedItemsDTO {
    const itemsMapped: CollectionFeaturedItemsDTO = formFeaturedItems.map((item, index) => {
      const { content, image, itemId } = item

      const itemDTO: CollectionFeaturedItemDTO = {
        content,
        order: index + 1,
        keepFile: false
      }

      const isNewItem = itemId === undefined
      const imageIsFile = image instanceof File
      const imageRemainsOriginal = typeof image === 'string' && image !== ''

      // Add itemId of existing item
      if (itemId) {
        itemDTO.id = itemId
      }

      // New item
      if (isNewItem) {
        itemDTO.file = imageIsFile ? image : undefined
        itemDTO.keepFile = false
      }

      // Existing item
      if (!isNewItem) {
        itemDTO.file = imageIsFile ? image : undefined
        itemDTO.keepFile = imageRemainsOriginal && !imageIsFile ? true : false
      }

      return itemDTO
    })

    return itemsMapped
  }
}
