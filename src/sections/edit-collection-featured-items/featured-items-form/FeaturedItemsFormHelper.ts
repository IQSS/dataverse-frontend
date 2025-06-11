import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  DvObjectFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'
import {
  CustomFeaturedItemField,
  DvObjectFeaturedItemField,
  FeaturedItemField,
  FeaturedItemsFormData
} from '../types'
import {
  CustomFeaturedItemDTO,
  CollectionFeaturedItemsDTO,
  DvObjectFeaturedItemDTO
} from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'

export class FeaturedItemsFormHelper {
  /**
   * @description To define the default form featured items values
   */
  static defineFormDefaultFeaturedItems(
    collectionFeaturedItems: CollectionFeaturedItem[]
  ): FeaturedItemsFormData['featuredItems'] {
    if (!collectionFeaturedItems.length) {
      return [{ type: 'base' }]
    }

    return collectionFeaturedItems.map((collectionFeaturedItem) => {
      if (collectionFeaturedItem.type === FeaturedItemType.CUSTOM) {
        const { id, content, imageFileUrl } = collectionFeaturedItem

        const customFeaturedItemFormFieldData: CustomFeaturedItemField = {
          itemId: id,
          type: FeaturedItemType.CUSTOM,
          content,
          image: imageFileUrl ? imageFileUrl : null
        }

        return customFeaturedItemFormFieldData
      } else {
        const { id, type, dvObjectIdentifier } = collectionFeaturedItem

        const dvObjectFeaturedItemFormFieldData: DvObjectFeaturedItemField = {
          itemId: id,
          type,
          dvObjectIdentifier
        }

        return dvObjectFeaturedItemFormFieldData
      }
    })
  }

  /**
   * @description This method is to transform current form data into "actual featured items" to show the current preview while the user is editing
   */
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
        const { itemId, type, dvObjectIdentifier } = field as DvObjectFeaturedItemField

        const currentFeaturedItem: DvObjectFeaturedItem = {
          id: itemId ?? this.generateFakeNumberId(),
          type,
          dvObjectIdentifier,
          displayOrder: index + 1
        }

        return currentFeaturedItem
      }
    })
  }

  /**
   * @description This method is to transform the form data into DTOs to send to the backend
   */
  static defineFeaturedItemsDTO(
    formFeaturedItems: FeaturedItemsFormData['featuredItems']
  ): CollectionFeaturedItemsDTO {
    const itemsMapped: CollectionFeaturedItemsDTO = formFeaturedItems.map((item, index) => {
      if (item.type === FeaturedItemType.CUSTOM) {
        const { content, image, itemId } = item

        const itemDTO: CustomFeaturedItemDTO = {
          type: FeaturedItemType.CUSTOM,
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
        const { itemId, type, dvObjectIdentifier } = item as DvObjectFeaturedItemField

        const itemDTO: DvObjectFeaturedItemDTO = {
          id: itemId ?? this.generateFakeNumberId(),
          type,
          dvObjectIdentifier,
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

  /**
   * @description This method checks if the image has a recommended aspect ratio (width is 30% greater than height).
   */

  static hasRecommendedAspectRatio(file: File): Promise<{
    hasRecommendedAspectRatio: boolean
    aspectRatioStringValue: string
  }> {
    return new Promise((resolve) => {
      const img = new Image()
      img.src = URL.createObjectURL(file)

      img.onload = () => {
        const { width, height } = img
        const aspectRatio = width / height

        const minRatio = 1.3 // means the width is 30% greater than the height

        URL.revokeObjectURL(img.src)

        const aspectRatioStringValue = FeaturedItemsFormHelper.getAspectRatioString(width, height)

        resolve({
          hasRecommendedAspectRatio: aspectRatio >= minRatio,
          aspectRatioStringValue: aspectRatioStringValue
        })
      }

      img.onerror = () =>
        resolve({
          hasRecommendedAspectRatio: false,
          aspectRatioStringValue: '0:0'
        })
    })
  }

  /**
   * @description This method calculates the aspect ratio of an image and returns it as a string in the format "width:height".
   * @example
   * getAspectRatioString(1920, 1080) // returns "16:9"
   * getAspectRatioString(800, 600) // returns "4:3"
   */
  static getAspectRatioString = (width: number, height: number): string => {
    const maxVal = 16

    const gcd = (a: number, b: number): number => {
      while (b !== 0) [a, b] = [b, a % b]
      return a
    }

    let w = width
    let h = height

    const divisor = gcd(w, h)
    w = w / divisor
    h = h / divisor

    // If the width or height is greater than the maxVal, scale it down
    if (w > maxVal || h > maxVal) {
      const scale = maxVal / Math.max(w, h)
      w = Math.round(w * scale)
      h = Math.round(h * scale)
      const reduced = gcd(w, h)
      w = w / reduced
      h = h / reduced
    }

    return `${w}:${h}`
  }
}
