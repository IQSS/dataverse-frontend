import {
  CollectionFeaturedItem,
  CustomFeaturedItem,
  FeaturedItemType
} from '@/collection/domain/models/CollectionFeaturedItem'
import { CustomFeaturedItemField, DvObjectFeaturedItemField, FeaturedItemsFormData } from '../types'
import {
  CustomFeaturedItemDTO,
  CollectionFeaturedItemsDTO,
  DvObjectFeaturedItemDTO
} from '@/collection/domain/useCases/DTOs/CollectionFeaturedItemsDTO'
import { QueryParamKey, Route } from '@/sections/Route.enum'

const locationOrigin =
  import.meta.env.STORYBOOK_CHROMATIC_BUILD === 'true' ? 'https://foo.com' : window.location.origin

const BASENAME_URL = import.meta.env.BASE_URL ?? ''

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
          dvObjectIdentifier,
          dvObjectUrl: this.transformDvObjectTypeAndIdentifierToSpaURL(type, dvObjectIdentifier)
        }

        return dvObjectFeaturedItemFormFieldData
      }
    })
  }

  /**
   * @description This method is to transform current form data into "actual featured items" to show the current preview while the user is editing
   */
  static transformCustomFormFieldsToFeaturedItems(
    featuredItemsFieldValues: CustomFeaturedItemField[]
  ): CustomFeaturedItem[] {
    return featuredItemsFieldValues.map((field, index) => {
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
          type: type as
            | FeaturedItemType.COLLECTION
            | FeaturedItemType.DATASET
            | FeaturedItemType.FILE,
          dvObjectIdentifier,
          displayOrder: index + 1
        }

        return itemDTO
      }
    })

    return itemsMapped
  }

  /**
   * @description This method parses a URL to extract the type and identifier of a Dataverse object (Collection, Dataset, or File). Works for URL's from the SPA and JSF versions of Dataverse.
   * @param input - The URL or DOI string to parse.
   * @returns An object containing the type and identifier of the Dataverse object, or null if the input is not a valid URL or does not match any known patterns.
   */

  static extractDvObjectTypeAndIdentiferFromUrlValue(input: string): {
    type: FeaturedItemType | null
    identifier: string | null
  } {
    const value = input.trim()

    // --- Direct DOI ---
    if (this.isValidDOI(value)) {
      return {
        type: FeaturedItemType.DATASET,
        identifier: value
      }
    }

    try {
      const url = new URL(value)
      const path = url.pathname.replace(/^\/spa/, '') // reomve "/spa" if exists
      const searchParams = url.searchParams

      // --- COLLECTION ---
      if (path.startsWith(`${Route.COLLECTIONS_BASE}/`) || path.startsWith('/dataverse/')) {
        const alias = path.split('/')[2]
        return {
          type: FeaturedItemType.COLLECTION,
          identifier: alias
        }
      }

      // --- DATASET ---
      if (path === Route.DATASETS || path === '/dataset.xhtml') {
        const pid = searchParams.get('persistentId')
        if (pid) {
          return {
            type: FeaturedItemType.DATASET,
            identifier: pid
          }
        }
      }

      // --- FILE ---
      if (path === Route.FILES || path === '/file.xhtml') {
        const fileId = searchParams.get('id') || searchParams.get('fileId')
        if (fileId) {
          return {
            type: FeaturedItemType.FILE,
            identifier: fileId
          }
        }
      }
    } catch (e) {
      // Not a valid constructed URL
      return {
        type: null,
        identifier: null
      }
    }

    return {
      type: null,
      identifier: null
    }
  }

  /**
   * @description This method transforms the type and identifier of a Dataverse object into a URL for the SPA version of Dataverse.
   * @param type - The type of the Dataverse object (Collection, Dataset, or File).
   * @param identifier - The identifier of the Dataverse object (e.g., alias for Collection, persistent ID for Dataset, or file ID for File).
   * @returns A string representing the URL for the specified Dataverse object.
   */

  static transformDvObjectTypeAndIdentifierToSpaURL = (
    type: FeaturedItemType.COLLECTION | FeaturedItemType.DATASET | FeaturedItemType.FILE,
    identifier: string
  ): string => {
    switch (type) {
      case FeaturedItemType.COLLECTION:
        return `${locationOrigin}${BASENAME_URL}${Route.COLLECTIONS_BASE}/${identifier}`
      case FeaturedItemType.DATASET:
        return `${locationOrigin}${BASENAME_URL}${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${identifier}`
      case FeaturedItemType.FILE:
        return `${locationOrigin}${BASENAME_URL}${Route.FILES}?${QueryParamKey.FILE_ID}=${identifier}`
      default:
        return '#' // Fallback URL if type is unknown
    }
  }

  static isValidDvObjectUrl(input: string): boolean {
    const trimmed = input.trim()

    if (!/^https?:\/\//i.test(trimmed)) {
      return false
    }

    try {
      const url = new URL(trimmed)
      const path = url.pathname.replace(/^\/spa/, '') // remove "/spa" if exists
      const searchParams = url.searchParams

      // --- COLLECTION ---
      if (path.startsWith(`${Route.COLLECTIONS_BASE}/`) || path.startsWith('/dataverse/')) {
        const alias = path.split('/')[2]
        return !!alias
      }

      // --- DATASET ---
      if (path === Route.DATASETS || path === '/dataset.xhtml') {
        const pid = searchParams.get('persistentId')
        return !!pid
      }

      // --- FILE ---
      if (path === Route.FILES || path === '/file.xhtml') {
        const fileId = searchParams.get('id') || searchParams.get('fileId')
        return !!fileId
      }

      return false
    } catch {
      return false
    }
  }

  /**
   * @description This method checks if a given string is a valid DOI (Digital Object Identifier). https://support.datacite.org/docs/doi-basics
   * @param value - The string to check.
   * @returns A boolean indicating whether the string is a valid DOI.
   */
  static isValidDOI(value: string): boolean {
    const doiRegex = /^https?:\/\/doi\.org\/10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i
    return doiRegex.test(value)
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
