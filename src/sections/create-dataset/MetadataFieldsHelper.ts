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

export class MetadataFieldsHelper {
  public static replaceDotNamesKeysWithSlash(
    metadataBlocks: MetadataBlockInfo[]
  ): MetadataBlockInfo[] {
    for (const block of metadataBlocks) {
      if (block.metadataFields) {
        this.dotReplacer(block.metadataFields)
      }
    }
    return metadataBlocks
  }

  private static dotReplacer(metadataFields: Record<string, MetadataField> | undefined) {
    if (!metadataFields) return

    for (const key in metadataFields) {
      const field = metadataFields[key]
      if (field.name.includes('.')) {
        field.name = field.name.replace(/\./g, '/')
      }
      if (field.childMetadataFields) {
        this.dotReplacer(field.childMetadataFields)
      }
    }
  }

  public static replaceSlashKeysWithDot(
    obj: FormCollectedValues | FormCollectedComposedFields
  ): FormCollectedValues | FormCollectedComposedFields {
    const newObj: FormCollectedValues | FormCollectedComposedFields = {}

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const newKey = key.replace(/\//g, '.')
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
          const replacedFields = this.replaceSlashKeysWithDot(
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

  public static formatFormValuesToCreateDatasetDTO(formValues: FormCollectedValues): DatasetDTO {
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

            if (
              typeof fieldValue === 'object' &&
              !Array.isArray(fieldValue) &&
              fieldValue !== null
            ) {
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
}
