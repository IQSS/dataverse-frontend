import {
  MetadataBlockInfo,
  MetadataField
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DatasetDTO,
  DatasetMetadataBlockValuesDTO,
  DatasetMetadataChildFieldValueDTO
} from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { FormCollectedComposedFields, FormCollectedValues } from './useCreateDatasetForm'

function dotReplacer(metadataFields: Record<string, MetadataField> | undefined) {
  if (!metadataFields) return

  for (const key in metadataFields) {
    const field = metadataFields[key]
    if (field.name.includes('.')) {
      field.name = field.name.replace(/\./g, '/')
    }
    if (field.childMetadataFields) {
      dotReplacer(field.childMetadataFields)
    }
  }
}
// To replace all field names properties that contain a dot with a slash, to avoid nesting objects in the form
export function replaceDotNamesKeysWithSlash(
  metadataBlocks: MetadataBlockInfo[]
): MetadataBlockInfo[] {
  for (const block of metadataBlocks) {
    if (block.metadataFields) {
      dotReplacer(block.metadataFields)
    }
  }
  return metadataBlocks
}

// To replace all saved form field names that contain a slash with a dot, turn them back to the original format
export function replaceSlashKeysWithDot(
  obj: FormCollectedValues | FormCollectedComposedFields
): FormCollectedValues | FormCollectedComposedFields {
  const newObj: FormCollectedValues | FormCollectedComposedFields = {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key.replace(/\//g, '.')
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        const replacedFields = replaceSlashKeysWithDot(
          obj[key] as FormCollectedComposedFields
        ) as FormCollectedComposedFields
        newObj[newKey] = replacedFields
      } else {
        newObj[newKey] = obj[key]
      }
    }
  }

  return newObj
}

// To format the form values to create a dataset DTO
export function formatFormValuesToCreateDatasetDTO(formValues: FormCollectedValues): DatasetDTO {
  const metadataBlocks: DatasetDTO['metadataBlocks'] = []

  for (const metadataBlockName in formValues) {
    const formattedMetadataBlock: DatasetMetadataBlockValuesDTO = {
      name: metadataBlockName,
      fields: {}
    }

    Object.entries(formValues[metadataBlockName]).forEach(
      ([fieldName, fieldValue]: [
        fieldName: string,
        fieldValue: string | string[] | Record<string, string>
      ]) => {
        if (fieldValue !== undefined && fieldValue !== '') {
          if (typeof fieldValue === 'string') {
            formattedMetadataBlock.fields[fieldName] = fieldValue
          }
          if (Array.isArray(fieldValue) && fieldValue.length > 0) {
            formattedMetadataBlock.fields[fieldName] = fieldValue
          }

          if (typeof fieldValue === 'object' && !Array.isArray(fieldValue) && fieldValue !== null) {
            const nestedFieldValues: DatasetMetadataChildFieldValueDTO = {}
            for (const nestedKey in fieldValue) {
              const nestedFieldValue = fieldValue[nestedKey]

              if (nestedFieldValue !== undefined && nestedFieldValue !== '') {
                nestedFieldValues[nestedKey] = nestedFieldValue
              }
            }
            if (Object.keys(nestedFieldValues).length > 0) {
              formattedMetadataBlock.fields[fieldName] = [nestedFieldValues]
            }
          }
        }
      }
    )

    metadataBlocks.push(formattedMetadataBlock)
  }

  return { metadataBlocks }
}
