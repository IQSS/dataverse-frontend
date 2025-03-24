import {
  MetadataBlockInfo,
  MetadataBlockInfoWithMaybeValues,
  MetadataField,
  MetadataFieldWithMaybeValue
} from '../../../../metadata-block-info/domain/models/MetadataBlockInfo'
import {
  DatasetDTO,
  DatasetMetadataBlockValuesDTO,
  DatasetMetadataChildFieldValueDTO
} from '../../../../dataset/domain/useCases/DTOs/DatasetDTO'
import {
  DatasetMetadataBlocks,
  DatasetMetadataFields,
  DatasetMetadataSubField,
  defaultLicense
} from '../../../../dataset/domain/models/Dataset'

export type DatasetMetadataFormValues = Record<string, MetadataBlockFormValues>

export type MetadataBlockFormValues = Record<
  string,
  string | PrimitiveMultipleFormValue | VocabularyMultipleFormValue | ComposedFieldValues
>

type VocabularyMultipleFormValue = string[]

type PrimitiveMultipleFormValue = { value: string }[]

type ComposedFieldValues = ComposedSingleFieldValue | ComposedSingleFieldValue[]

type ComposedSingleFieldValue = Record<string, string>

export class MetadataFieldsHelper {
  public static replaceMetadataBlocksInfoDotNamesKeysWithSlash(
    metadataBlocks: MetadataBlockInfo[]
  ): MetadataBlockInfo[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const metadataBlocksCopy: MetadataBlockInfo[] = structuredClone(metadataBlocks)

    for (const block of metadataBlocksCopy) {
      if (block.metadataFields) {
        this.metadataBlocksInfoDotReplacer(block.metadataFields)
      }
    }
    return metadataBlocksCopy
  }

  private static metadataBlocksInfoDotReplacer(metadataFields: Record<string, MetadataField>) {
    for (const key in metadataFields) {
      const field = metadataFields[key]
      if (field.name.includes('.')) {
        field.name = this.replaceDotWithSlash(field.name)
      }
      if (field.childMetadataFields) {
        this.metadataBlocksInfoDotReplacer(field.childMetadataFields)
      }
    }
  }

  public static replaceDatasetMetadataBlocksCurrentValuesDotKeysWithSlash(
    datasetMetadataBlocks: DatasetMetadataBlocks
  ): DatasetMetadataBlocks {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const datasetMetadataBlocksCopy: DatasetMetadataBlocks = structuredClone(datasetMetadataBlocks)
    const dataWithoutKeysWithDots: DatasetMetadataBlocks = [] as unknown as DatasetMetadataBlocks

    for (const block of datasetMetadataBlocksCopy) {
      const newBlockFields: DatasetMetadataFields =
        this.datasetMetadataBlocksCurrentValuesDotReplacer(block.fields)

      const newBlock = {
        name: block.name,
        fields: newBlockFields
      }

      dataWithoutKeysWithDots.push(newBlock)
    }

    return dataWithoutKeysWithDots
  }

  private static datasetMetadataBlocksCurrentValuesDotReplacer(
    datasetMetadataFields: DatasetMetadataFields
  ): DatasetMetadataFields {
    const datasetMetadataFieldsNormalized: DatasetMetadataFields = {}

    for (const key in datasetMetadataFields) {
      const newKey = key.includes('.') ? this.replaceDotWithSlash(key) : key

      const value = datasetMetadataFields[key]

      // Case of DatasetMetadataSubField
      if (typeof value === 'object' && !Array.isArray(value)) {
        const nestedKeysMapped = Object.entries(value).reduce((acc, [nestedKey, nestedValue]) => {
          const newNestedKey = nestedKey.includes('.')
            ? this.replaceDotWithSlash(nestedKey)
            : nestedKey

          acc[newNestedKey] = nestedValue
          return acc
        }, {} as DatasetMetadataSubField)

        datasetMetadataFieldsNormalized[newKey] = nestedKeysMapped
      } else if (
        Array.isArray(value) &&
        (value as readonly (string | DatasetMetadataSubField)[]).every((v) => typeof v === 'object')
      ) {
        // Case of DatasetMetadataSubField[]
        const nestedKeysMapped = value.map((subFields) => {
          return Object.entries(subFields).reduce((acc, [nestedKey, nestedValue]) => {
            const newNestedKey = nestedKey.includes('.')
              ? this.replaceDotWithSlash(nestedKey)
              : nestedKey

            acc[newNestedKey] = nestedValue
            return acc
          }, {} as DatasetMetadataSubField)
        })
        datasetMetadataFieldsNormalized[newKey] = nestedKeysMapped
      } else {
        datasetMetadataFieldsNormalized[newKey] = value
      }
    }

    return datasetMetadataFieldsNormalized
  }

  public static getFormDefaultValues(
    metadataBlocks: MetadataBlockInfoWithMaybeValues[]
  ): DatasetMetadataFormValues {
    const formDefaultValues: DatasetMetadataFormValues = {}

    for (const block of metadataBlocks) {
      const blockValues: MetadataBlockFormValues = {}

      for (const field of Object.values(block.metadataFields)) {
        const fieldName = field.name
        const fieldValue = field.value

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

          if (fieldValue) {
            const castedFieldValue = fieldValue as
              | DatasetMetadataSubField
              | DatasetMetadataSubField[]

            let fieldValues: ComposedFieldValues

            if (Array.isArray(castedFieldValue)) {
              const subFieldsWithValuesPlusEmptyOnes = castedFieldValue.map((subFields) => {
                const fieldsValueNormalized: Record<string, string> = Object.entries(
                  subFields
                ).reduce((acc, [key, value]) => {
                  if (value !== undefined) {
                    acc[key] = value
                  }
                  return acc
                }, {} as Record<string, string>)

                return {
                  ...childFieldsWithEmptyValues,
                  ...fieldsValueNormalized
                }
              })

              fieldValues = subFieldsWithValuesPlusEmptyOnes
            } else {
              const fieldsValueNormalized: Record<string, string> = Object.entries(
                castedFieldValue
              ).reduce((acc, [key, value]) => {
                if (value !== undefined) {
                  acc[key] = value
                }
                return acc
              }, {} as Record<string, string>)

              fieldValues = {
                ...childFieldsWithEmptyValues,
                ...fieldsValueNormalized
              }
            }

            blockValues[fieldName] = fieldValues
          } else {
            blockValues[fieldName] = field.multiple
              ? [childFieldsWithEmptyValues]
              : childFieldsWithEmptyValues
          }
        }

        if (field.typeClass === 'primitive') {
          blockValues[fieldName] = this.getPrimitiveFieldDefaultFormValue(field)
        }

        if (field.typeClass === 'controlledVocabulary') {
          blockValues[fieldName] = this.getControlledVocabFieldDefaultFormValue(field)
        }
      }

      formDefaultValues[block.name] = blockValues
    }

    return formDefaultValues
  }

  private static getPrimitiveFieldDefaultFormValue(
    field: MetadataFieldWithMaybeValue
  ): string | PrimitiveMultipleFormValue {
    if (field.multiple) {
      const castedFieldValue = field.value as string[] | undefined

      if (!castedFieldValue) return [{ value: '' }]

      return castedFieldValue.map((stringValue) => ({ value: stringValue }))
    }
    const castedFieldValue = field.value as string | undefined
    return castedFieldValue ?? ''
  }

  private static getControlledVocabFieldDefaultFormValue(
    field: MetadataFieldWithMaybeValue
  ): string | VocabularyMultipleFormValue {
    if (field.multiple) {
      const castedFieldValue = field.value as string[] | undefined

      if (!castedFieldValue) return []

      return castedFieldValue
    }
    const castedFieldValue = field.value as string | undefined
    return castedFieldValue ?? ''
  }

  public static replaceSlashKeysWithDot(obj: DatasetMetadataFormValues): DatasetMetadataFormValues {
    const formattedNewObject: DatasetMetadataFormValues = {}

    for (const key in obj) {
      const blockKey = this.replaceSlashWithDot(key)
      const metadataBlockFormValues = obj[key]

      formattedNewObject[blockKey] = {}

      Object.entries(metadataBlockFormValues).forEach(([fieldName, fieldValue]) => {
        const newFieldName = this.replaceSlashWithDot(fieldName)

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
            const newNestedFieldName = this.replaceSlashWithDot(nestedFieldName)
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
              const newNestedFieldName = this.replaceSlashWithDot(nestedFieldName)

              composedField[newNestedFieldName] = nestedFieldValue
            })

            return composedField
          })
        }
      })
    }

    return formattedNewObject
  }

  public static formatFormValuesToDatasetDTO(
    formValues: DatasetMetadataFormValues,
    mode: 'create' | 'edit'
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
          if (fieldValue !== '' || mode === 'edit') {
            formattedMetadataBlock.fields[fieldName] = fieldValue
            return
          }
          return
        }
        if (this.isVocabularyMultipleFieldValue(fieldValue)) {
          if (fieldValue.length > 0 || mode === 'edit') {
            formattedMetadataBlock.fields[fieldName] = fieldValue
            return
          }
          return
        }

        if (this.isPrimitiveMultipleFieldValue(fieldValue)) {
          const primitiveMultipleFieldValues = fieldValue
            .map((primitiveField) => primitiveField.value)
            .filter((v) => v !== '')

          console.log({ primitiveMultipleFieldValues })

          if (primitiveMultipleFieldValues.length > 0 || mode === 'edit') {
            formattedMetadataBlock.fields[fieldName] = primitiveMultipleFieldValues
            return
          }
          return
        }

        if (this.isComposedSingleFieldValue(fieldValue)) {
          const formattedMetadataChildFieldValue: DatasetMetadataChildFieldValueDTO = {}

          Object.entries(fieldValue).forEach(([nestedFieldName, nestedFieldValue]) => {
            if (nestedFieldValue !== '' || mode === 'edit') {
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
              if (nestedFieldValue !== '' || mode === 'edit') {
                composedField[nestedFieldName] = nestedFieldValue
              }
            })
            if (Object.keys(composedField).length > 0 || mode === 'edit') {
              formattedMetadataChildFieldValues.push(composedField)
            }
          })
          if (formattedMetadataChildFieldValues.length > 0 || mode === 'edit') {
            formattedMetadataBlock.fields[fieldName] = formattedMetadataChildFieldValues
          }

          return
        }
      })

      metadataBlocks.push(formattedMetadataBlock)
    }
    return { licence: defaultLicense, metadataBlocks }
  }

  public static addFieldValuesToMetadataBlocksInfo(
    normalizedMetadataBlocksInfo: MetadataBlockInfo[],
    normalizedDatasetMetadaBlocksCurrentValues: DatasetMetadataBlocks
  ): MetadataBlockInfoWithMaybeValues[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const normalizedMetadataBlocksInfoCopy: MetadataBlockInfoWithMaybeValues[] = structuredClone(
      normalizedMetadataBlocksInfo
    )

    const normalizedCurrentValuesMap: Record<string, DatasetMetadataFields> =
      normalizedDatasetMetadaBlocksCurrentValues.reduce((map, block) => {
        map[block.name] = block.fields
        return map
      }, {} as Record<string, DatasetMetadataFields>)

    normalizedMetadataBlocksInfoCopy.forEach((block) => {
      const currentBlockValues = normalizedCurrentValuesMap[block.name]

      if (currentBlockValues) {
        Object.keys(block.metadataFields).forEach((fieldName) => {
          const field = block.metadataFields[fieldName]

          if (this.replaceDotWithSlash(fieldName) in currentBlockValues) {
            field.value = currentBlockValues[this.replaceDotWithSlash(fieldName)]
          }
        })
      }
    })

    return normalizedMetadataBlocksInfoCopy
  }

  private static replaceDotWithSlash = (str: string) => str.replace(/\./g, '/')
  private static replaceSlashWithDot = (str: string) => str.replace(/\//g, '.')

  /*
   * To define the field name that will be used to register the field in the form
   * Most basic could be: metadataBlockName.name eg: citation.title
   * If the field is part of a compound field, the name will be: metadataBlockName.compoundParentName.name eg: citation.author.authorName
   * If the field is part of an array of fields, the name will be: metadataBlockName.fieldsArrayIndex.name.value eg: citation.alternativeTitle.0.value
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
