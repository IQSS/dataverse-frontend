import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  DvObjectFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'
import {
  CollectionCustomFeaturedItemDTO,
  CollectionDvObjectFeaturedItemDTO,
  CollectionFeaturedItemsDTO
} from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'
import { DvObjectFeaturedItemField, FeaturedItemField, FeaturedItemsFormData } from '../types'

export class FeaturedItemsFormHelper {
  // To define the default form featured items values
  static defineFormDefaultFeaturedItems(
    collectionFeaturedItems: CollectionFeaturedItem[]
  ): FeaturedItemsFormData['featuredItems'] {
    // If the collection has no default featured items, by default we show a blank custom field, user will be able to change to dv object if wants to
    if (!collectionFeaturedItems.length) {
      return [
        {
          type: 'base'
          // content: '',
          // image: null,
          // type: FeaturedItemType.CUSTOM
        }
      ]
    }

    return collectionFeaturedItems.map((collectionFeaturedItem) => {
      if (collectionFeaturedItem.type === FeaturedItemType.CUSTOM) {
        const { id, content, imageFileUrl } = collectionFeaturedItem

        return {
          itemId: id,
          type: FeaturedItemType.CUSTOM,
          content,
          image: imageFileUrl ? imageFileUrl : null
        }
      } else {
        const { id, type, dvObjectId, description, displayOrder } =
          collectionFeaturedItem as DvObjectFeaturedItem

        return {
          itemId: id,
          type,
          dvObjectId,
          description,
          displayOrder
        }
      }
    })
  }

  // This method is to transform current form data into "actual featured items" to show the current preview while the user is editing
  static transformFormFieldsToFeaturedItems(
    featuredItemsFieldValues: FeaturedItemField[]
  ): CollectionFeaturedItem[] {
    return featuredItemsFieldValues.map((field, index) => {
      if (field.type === FeaturedItemType.CUSTOM) {
        const { content, image, itemId } = field

        const currentFeaturedItem: CustomFeaturedItem = {
          id: itemId ?? this.generateFakeNumberId(),
          type: FeaturedItemType.CUSTOM,
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
      } else {
        const { itemId, type, dvObjectId, description } = field as DvObjectFeaturedItemField

        const currentFeaturedItem: DvObjectFeaturedItem = {
          id: itemId ?? this.generateFakeNumberId(),
          type,
          dvObjectId,
          description,
          displayOrder: index + 1
        }

        return currentFeaturedItem
      }
    })
  }

  // This method is to transform the form data into DTOs to send to the backend
  static defineFeaturedItemsDTO(
    formFeaturedItems: FeaturedItemsFormData['featuredItems']
  ): CollectionFeaturedItemsDTO {
    const itemsMapped: CollectionFeaturedItemsDTO = formFeaturedItems.map((item, index) => {
      if (item.type === FeaturedItemType.CUSTOM) {
        const { content, image, itemId } = item

        const itemDTO: CollectionCustomFeaturedItemDTO = {
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
      } else {
        const { itemId, dvObjectId, description } = item as DvObjectFeaturedItemField

        const itemDTO: CollectionDvObjectFeaturedItemDTO = {
          id: itemId ?? this.generateFakeNumberId(),
          dvObjectId,
          description,
          displayOrder: index + 1
        }

        return itemDTO
      }
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
