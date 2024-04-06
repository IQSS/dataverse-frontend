import { UseControllerProps } from 'react-hook-form'
import {
  DateFormatsOptions,
  MetadataField2,
  TypeMetadataFieldOptions
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  isValidDateFormat,
  isValidEmail,
  isValidFloat,
  isValidInteger,
  isValidURL
} from '../../../../metadata-block-info/domain/models/fieldValidations'

interface Props {
  metadataFieldInfo: MetadataField2
  isSafePrimitive: boolean
}

// TODO:ME - USE LOCALES FOR ERROR MESSAGES

/**
 * Define the rules to apply to the metadata field
 * @param metadataFieldInfo Information about the metadata field
 * @param isSafePrimitive If the metadata field is a primitive type
 * @returns The rules to apply to the metadata field
 */

export const useDefineRules = ({ metadataFieldInfo, isSafePrimitive }: Props) => {
  const { type, displayName, isRequired, watermark } = metadataFieldInfo

  const rulesToApply: UseControllerProps['rules'] = {
    required: isRequired ? `${displayName} is required` : false,
    validate: (value: string) => {
      if (!value) {
        return true
      }
      if (isSafePrimitive) {
        if (type === TypeMetadataFieldOptions.URL) {
          if (!isValidURL(value)) {
            return `${displayName} is not a valid URL`
          }
          return true
        }
        if (type === TypeMetadataFieldOptions.Date) {
          const acceptedDateFormat =
            watermark === 'YYYY-MM-DD' ? DateFormatsOptions.YYYYMMDD : undefined

          if (!isValidDateFormat(value, acceptedDateFormat)) {
            return `${displayName} must be format ${watermark}`
          }
          return true
        }
        if (type === TypeMetadataFieldOptions.Email) {
          if (!isValidEmail(value)) {
            return `${displayName} is not a valid email`
          }
          return true
        }
        if (type === TypeMetadataFieldOptions.Int) {
          if (!isValidInteger(value)) {
            return `${displayName} is not a valid integer`
          }
          return true
        }
        if (type === TypeMetadataFieldOptions.Float) {
          if (!isValidFloat(value)) {
            return `${displayName} is not a valid float`
          }
          return true
        }
      }

      return true
    }
  }

  return rulesToApply
}
