import { CollectionFeaturedItem } from '@/collection/domain/models/CollectionFeaturedItem'
import { FeaturedItemField, FeaturedItemsFormData } from '../types'
import {
  CollectionFeaturedItemDTO,
  CollectionFeaturedItemsDTO
} from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'

export class FeaturedItemsFormHelper {
  // To define the default form featured items values
  static defineFormDefaultFeaturedItems(
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
      const { id, content, imageFileUrl } = collectionFeaturedItem

      return {
        content,
        image: imageFileUrl ? imageFileUrl : null,
        itemId: id
      }
    })
  }

  // This method is to transform current form data into "actual featured items" to show the current preview while the user is editing
  static transformFormFieldsToFeaturedItems(
    featuredItemsFieldValues: FeaturedItemField[]
  ): CollectionFeaturedItem[] {
    return featuredItemsFieldValues.map((field, index) => {
      const { content, image, itemId } = field

      const currentFeaturedItem: CollectionFeaturedItem = {
        id: itemId ?? this.generateFakeNumberId(),
        displayOrder: index + 1,
        content
      }

      if (image && image instanceof File) {
        const objectUrl = URL.createObjectURL(image)

        currentFeaturedItem.imageFileUrl = objectUrl
      }

      if (image && typeof image === 'string') {
        currentFeaturedItem.imageFileUrl = image
      }

      return currentFeaturedItem
    })
  }

  // This method is to transform the form data into DTOs to send to the backend
  static defineFeaturedItemsDTO(
    formFeaturedItems: FeaturedItemsFormData['featuredItems']
  ): CollectionFeaturedItemsDTO {
    const itemsMapped: CollectionFeaturedItemsDTO = formFeaturedItems.map((item, index) => {
      const { content, image, itemId } = item

      const itemDTO: CollectionFeaturedItemDTO = {
        content,
        displayOrder: index,
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

  static formatBytes(bytes: number, decimals = 2): string {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  }

  static generateFakeNumberId(): number {
    return Date.now() + Math.floor(Math.random() * 1000)
  }
}
