import {
  MetadataBlockInfo,
  MetadataField
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DatasetDTO,
  DatasetMetadataBlockValuesDTO,
  DatasetMetadataChildFieldValueDTO
} from '../../dataset/domain/useCases/DTOs/DatasetDTO'

export type CreateDatasetFormValues = Record<string, MetadataBlockFormValues>

export type MetadataBlockFormValues = Record<
  string,
  string | PrimitiveMultipleFormValue | VocabularyMultipleFormValue | ComposedFieldValues
>

type VocabularyMultipleFormValue = string[]

type PrimitiveMultipleFormValue = { value: string }[]

type ComposedFieldValues = ComposedSingleFieldValue | ComposedSingleFieldValue[]

type ComposedSingleFieldValue = Record<string, string>

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

  public static getFormDefaultValues(metadataBlocks: MetadataBlockInfo[]): CreateDatasetFormValues {
    const formDefaultValues: CreateDatasetFormValues = {}

    for (const block of metadataBlocks) {
      const blockValues: MetadataBlockFormValues = {}

      for (const field of Object.values(block.metadataFields)) {
        const fieldName = field.name

        if (field.typeClass === 'compound') {
          const childFieldsWithEmptyValues: Record<string, string> = {}

          if (field.childMetadataFields) {
            for (const childField of Object.values(field.childMetadataFields)) {
              if (childField.typeClass === 'primitive') {
                childFieldsWithEmptyValues[childField.name] = ''
              }

              if (childField.typeClass === 'controlledVocabulary') {
                childFieldsWithEmptyValues[childField.name] = ''
              }
            }
          }
          blockValues[fieldName] = field.multiple
            ? [childFieldsWithEmptyValues]
            : childFieldsWithEmptyValues
        }

        if (field.typeClass === 'primitive') {
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

  public static replaceSlashKeysWithDot(obj: CreateDatasetFormValues): CreateDatasetFormValues {
    const formattedNewObject: CreateDatasetFormValues = {}

    for (const key in obj) {
      const blockKey = key.replace(/\//g, '.')
      const metadataBlockFormValues = obj[key]

      formattedNewObject[blockKey] = {}

      Object.entries(metadataBlockFormValues).forEach(([fieldName, fieldValue]) => {
        const newFieldName = fieldName.replace(/\//g, '.')

        if (
          this.isPrimitiveFieldValue(fieldValue) ||
          this.isVocabularyMultipleFieldValue(fieldValue) ||
          this.isPrimitiveMultipleFieldValue(fieldValue)
        ) {
          formattedNewObject[blockKey][newFieldName] = fieldValue
          return
        }

        if (this.isComposedSingleFieldValue(fieldValue)) {
          formattedNewObject[blockKey][newFieldName] = {}
          Object.entries(fieldValue).forEach(([nestedFieldName, nestedFieldValue]) => {
            const newNestedFieldName = nestedFieldName.replace(/\//g, '.')
            const parentOfNestedField = formattedNewObject[blockKey][
              newFieldName
            ] as ComposedSingleFieldValue

            parentOfNestedField[newNestedFieldName] = nestedFieldValue
          })
          return
        }

        if (this.isComposedMultipleFieldValue(fieldValue)) {
          formattedNewObject[blockKey][newFieldName] = fieldValue.map((composedFieldValues) => {
            const composedField: ComposedSingleFieldValue = {}

            Object.entries(composedFieldValues).forEach(([nestedFieldName, nestedFieldValue]) => {
              const newNestedFieldName = nestedFieldName.replace(/\//g, '.')

              composedField[newNestedFieldName] = nestedFieldValue
            })

            return composedField
          })
        }
      })
    }

    return formattedNewObject
  }

  public static formatFormValuesToCreateDatasetDTO(
    formValues: CreateDatasetFormValues
  ): DatasetDTO {
    const metadataBlocks: DatasetDTO['metadataBlocks'] = []

    for (const metadataBlockName in formValues) {
      const formattedMetadataBlock: DatasetMetadataBlockValuesDTO = {
        name: metadataBlockName,
        fields: {}
      }
      const metadataBlockFormValues = formValues[metadataBlockName]

      Object.entries(metadataBlockFormValues).forEach(([fieldName, fieldValue]) => {
        if (this.isPrimitiveFieldValue(fieldValue)) {
          if (fieldValue !== '') {
            formattedMetadataBlock.fields[fieldName] = fieldValue
            return
          }
          return
        }
        if (this.isVocabularyMultipleFieldValue(fieldValue)) {
          if (fieldValue.length > 0) {
            formattedMetadataBlock.fields[fieldName] = fieldValue
            return
          }
          return
        }

        if (this.isPrimitiveMultipleFieldValue(fieldValue)) {
          const primitiveMultipleFieldValues = fieldValue
            .map((primitiveField) => primitiveField.value)
            .filter((v) => v !== '')

          if (primitiveMultipleFieldValues.length > 0) {
            formattedMetadataBlock.fields[fieldName] = primitiveMultipleFieldValues
            return
          }
          return
        }

        if (this.isComposedSingleFieldValue(fieldValue)) {
          const formattedMetadataChildFieldValue: DatasetMetadataChildFieldValueDTO = {}

          Object.entries(fieldValue).forEach(([nestedFieldName, nestedFieldValue]) => {
            if (nestedFieldValue !== '') {
              formattedMetadataChildFieldValue[nestedFieldName] = nestedFieldValue
            }
          })
          if (Object.keys(formattedMetadataChildFieldValue).length > 0) {
            formattedMetadataBlock.fields[fieldName] = formattedMetadataChildFieldValue
            return
          }
          return
        }

        if (this.isComposedMultipleFieldValue(fieldValue)) {
          const formattedMetadataChildFieldValues: DatasetMetadataChildFieldValueDTO[] = []

          fieldValue.forEach((composedFieldValues) => {
            const composedField: DatasetMetadataChildFieldValueDTO = {}
            Object.entries(composedFieldValues).forEach(([nestedFieldName, nestedFieldValue]) => {
              if (nestedFieldValue !== '') {
                composedField[nestedFieldName] = nestedFieldValue
              }
            })
            if (Object.keys(composedField).length > 0) {
              formattedMetadataChildFieldValues.push(composedField)
            }
          })
          if (formattedMetadataChildFieldValues.length > 0) {
            formattedMetadataBlock.fields[fieldName] = formattedMetadataChildFieldValues
          }

          return
        }
      })

      metadataBlocks.push(formattedMetadataBlock)
    }
    return { metadataBlocks }
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

  private static isPrimitiveFieldValue = (value: unknown): value is string => {
    return typeof value === 'string'
  }
  private static isPrimitiveMultipleFieldValue = (
    value: unknown
  ): value is PrimitiveMultipleFormValue => {
    return Array.isArray(value) && value.every((v) => typeof v === 'object' && 'value' in v)
  }
  private static isVocabularyMultipleFieldValue = (
    value: unknown
  ): value is VocabularyMultipleFormValue => {
    return Array.isArray(value) && value.every((v) => typeof v === 'string')
  }
  private static isComposedSingleFieldValue = (
    value: unknown
  ): value is ComposedSingleFieldValue => {
    return typeof value === 'object' && !Array.isArray(value)
  }
  private static isComposedMultipleFieldValue = (
    value: unknown
  ): value is ComposedSingleFieldValue[] => {
    return Array.isArray(value) && value.every((v) => typeof v === 'object')
  }
}
