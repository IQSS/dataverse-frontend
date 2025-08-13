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
  isParentFieldRequired?: boolean
}

export type DefinedRules = UseControllerProps['rules']

export const useDefineRules = ({
  metadataFieldInfo,
  isParentFieldRequired
}: Props): DefinedRules => {
  const { t } = useTranslation('shared', { keyPrefix: 'datasetMetadataForm' })
  const { type, displayName, isRequired, watermark } = metadataFieldInfo

  // A sub field is required if the parent field is required and the sub field is required
  const isFieldRequired =
    isParentFieldRequired !== undefined ? isParentFieldRequired && isRequired : isRequired

  const rulesToApply: DefinedRules = {
    required: isFieldRequired
      ? t('field.required', { displayName, interpolation: { escapeValue: false } })
      : false,
    validate: (value: string) => {
      if (!value) {
        return true
      }

      if (type === TypeMetadataFieldOptions.URL) {
        if (!isValidURL(value)) {
          return t('field.invalid.url', { displayName, interpolation: { escapeValue: false } })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Date) {
        const acceptedDateFormat =
          watermark === 'YYYY-MM-DD' ? DateFormatsOptions.YYYYMMDD : undefined

        if (!isValidDateFormat(value, acceptedDateFormat)) {
          return t('field.invalid.date', {
            displayName,
            dateFormat: watermark,
            interpolation: { escapeValue: false }
          })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Email) {
        if (!isValidEmail(value)) {
          return t('field.invalid.email', { displayName, interpolation: { escapeValue: false } })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Int) {
        if (!isValidInteger(value)) {
          return t('field.invalid.int', { displayName, interpolation: { escapeValue: false } })
        }
        return true
      }
      if (type === TypeMetadataFieldOptions.Float) {
        if (!isValidFloat(value)) {
          return t('field.invalid.float', { displayName, interpolation: { escapeValue: false } })
        }
        return true
      }

      return true
    }
  }

  return rulesToApply
}
