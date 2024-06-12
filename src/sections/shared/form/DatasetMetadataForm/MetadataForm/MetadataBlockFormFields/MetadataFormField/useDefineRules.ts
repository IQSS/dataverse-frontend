import { UseControllerProps } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  DateFormatsOptions,
  type MetadataField,
  TypeMetadataFieldOptions
} from '../../../../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  isValidURL,
  isValidFloat,
  isValidEmail,
  isValidInteger,
  isValidDateFormat
} from '../../../../../../../metadata-block-info/domain/models/fieldValidations'

interface Props {
  metadataFieldInfo: MetadataField
}

export type DefinedRules = UseControllerProps['rules']

export const useDefineRules = ({ metadataFieldInfo }: Props): DefinedRules => {
  const { t } = useTranslation('datasetMetadataForm')
  const { type, displayName, isRequired, watermark } = metadataFieldInfo

  const rulesToApply: DefinedRules = {
    required: isRequired ? t('field.required', { displayName }) : false,
    validate: (value: string) => {
      if (!value) {
        return true
      }

      if (type === TypeMetadataFieldOptions.URL) {
        if (!isValidURL(value)) {
          return t('field.invalid.url', { displayName })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Date) {
        const acceptedDateFormat =
          watermark === 'YYYY-MM-DD' ? DateFormatsOptions.YYYYMMDD : undefined

        if (!isValidDateFormat(value, acceptedDateFormat)) {
          return t('field.invalid.date', { displayName, dateFormat: watermark })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Email) {
        if (!isValidEmail(value)) {
          return t('field.invalid.email', { displayName })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Int) {
        if (!isValidInteger(value)) {
          return t('field.invalid.int', { displayName })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Float) {
        if (!isValidFloat(value)) {
          return t('field.invalid.float', { displayName })
        }
        return true
      }

      return true
    }
  }

  return rulesToApply
}
