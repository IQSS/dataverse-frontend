import { UseControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  DateFormatsOptions,
  MetadataField,
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
  metadataFieldInfo: MetadataField
}

/**
 * Define the rules to apply to the metadata field
 * @param metadataFieldInfo Information about the metadata field
 * @returns The rules to apply to the metadata field
 */

export const useDefineRules = ({ metadataFieldInfo }: Props) => {
  const { t } = useTranslation('createDataset')
  const { type, displayName, isRequired, watermark } = metadataFieldInfo

  const rulesToApply: UseControllerProps['rules'] = {
    required: isRequired ? t('datasetForm.field.required', { displayName }) : false,
    validate: (value: string) => {
      if (!value) {
        return true
      }

      if (type === TypeMetadataFieldOptions.URL) {
        if (!isValidURL(value)) {
          return t('datasetForm.field.invalid.url', { displayName })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Date) {
        const acceptedDateFormat =
          watermark === 'YYYY-MM-DD' ? DateFormatsOptions.YYYYMMDD : undefined

        if (!isValidDateFormat(value, acceptedDateFormat)) {
          return t('datasetForm.field.invalid.date', { displayName, dateFormat: watermark })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Email) {
        if (!isValidEmail(value)) {
          return t('datasetForm.field.invalid.email', { displayName })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Int) {
        if (!isValidInteger(value)) {
          return t('datasetForm.field.invalid.int', { displayName })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Float) {
        if (!isValidFloat(value)) {
          return t('datasetForm.field.invalid.float', { displayName })
        }
        return true
      }

      return true
    }
  }

  return rulesToApply
}
