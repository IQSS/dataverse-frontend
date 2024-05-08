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

export type FormDefaultValues = Record<
  string,
  Record<string, string | string[] | Record<string, string> | Record<string, string>[]>
>

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

  public static getFormDefaultValues(metadataBlocks: MetadataBlockInfo[]): FormDefaultValues {
    const formDefaultValues: FormDefaultValues = {}

    for (const block of metadataBlocks) {
      const blockValues: Record<
        string,
        string | string[] | Record<string, string> | Record<string, string>[]
      > = {}

      for (const field of Object.values(block.metadataFields)) {
        const fieldName = field.name

        if (field.typeClass === 'compound') {
          const childFieldsWithEmptyValues: Record<string, string> = {}
          if (field.childMetadataFields) {
            for (const childField of Object.values(field.childMetadataFields)) {
              childFieldsWithEmptyValues[childField.name] = ''
            }
          }

          blockValues[fieldName] = field.multiple
            ? [childFieldsWithEmptyValues]
            : childFieldsWithEmptyValues
        }

        if (field.typeClass === 'primitive') {
          // A primitive that can be multiplied e.g: Alternative Title: ['titleone', 'titletwo'] or just 'title'
          blockValues[fieldName] = field.multiple ? [{ value: '' }] : ''
        }

        if (field.typeClass === 'controlledVocabulary') {
          blockValues[fieldName] = field.multiple ? [] : ''
        }
      }

      formDefaultValues[block.name] = blockValues
    }

    return formDefaultValues
  }

  /*
   * To define the field name that will be used to register the field in the form
   * Most basic could be: metadataBlockName.name eg: citation.title
   * If the field is part of a compound field, the name will be: metadataBlockName.compoundParentName.name eg: citation.author.authorName
   * If the field is part of an array of fields, the name will be: metadataBlockName.fieldsArrayIndex.name eg: citation.alternativeTitle.0.value
   * If the field is part of a compound field that is part of an array of fields, the name will be: metadataBlockName.compoundParentName.fieldsArrayIndex.name eg: citation.author.0.authorName
   */
  public static defineFieldName(
    name: string,
    metadataBlockName: string,
    compoundParentName?: string,
    fieldsArrayIndex?: number
  ) {
    if (fieldsArrayIndex !== undefined && !compoundParentName) {
      return `${metadataBlockName}.${name}.${fieldsArrayIndex}.value`
    }
    if (fieldsArrayIndex !== undefined && compoundParentName) {
      return `${metadataBlockName}.${compoundParentName}.${fieldsArrayIndex}.${name}`
    }

    if (compoundParentName) {
      return `${metadataBlockName}.${compoundParentName}.${name}`
    }
    return `${metadataBlockName}.${name}`
  }
}
