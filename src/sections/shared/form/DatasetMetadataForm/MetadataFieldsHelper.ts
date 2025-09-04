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

export type ComposedSingleFieldValue = Record<string, string>

// TODO:ME - Probably we dont need structuredClone if some places
// TODO:ME - Clean comments made in spanish

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

  public static replaceDatasetMetadataBlocksDotKeysWithSlash(
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
  public static replaceSlashWithDot = (str: string) => str.replace(/\//g, '.')

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

  /**
   * To define the metadata blocks info that will be used to render the form.
   * In create mode, if a template is provided, it adds the fields from the template to the metadata blocks info for create.
   * It also adds the values from the template to the metadata blocks info for create.
   * In edit mode, it adds the current values to the metadata blocks info for edit.
   * Finally, it orders the fields by display order.
   */
  public static defineMetadataBlockInfo(
    mode: 'create' | 'edit',
    metadataBlocksInfoForDisplayOnCreate: MetadataBlockInfo[],
    metadataBlocksInfoForDisplayOnEdit: MetadataBlockInfo[],
    datasetMetadaBlocksCurrentValues: DatasetMetadataBlocks | undefined,
    templateMetadataBlocks: DatasetMetadataBlocks | undefined
  ): MetadataBlockInfo[] {
    // Replace field names with dots to slashes, to avoid issues with the form library react-hook-form
    const normalizedMetadataBlocksInfoForDisplayOnCreate =
      this.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfoForDisplayOnCreate)

    const normalizedMetadataBlocksInfoForDisplayOnEdit =
      this.replaceMetadataBlocksInfoDotNamesKeysWithSlash(metadataBlocksInfoForDisplayOnEdit)

    // CREATE MODE
    if (mode === 'create') {
      // If we have no template, we just return the metadata blocks info for create with normalized field names
      if (!templateMetadataBlocks) {
        return normalizedMetadataBlocksInfoForDisplayOnCreate
      }

      // 1) Normalize dataset template fields
      const normalizedDatasetTemplateMetadataBlocksValues =
        this.replaceDatasetMetadataBlocksDotKeysWithSlash(templateMetadataBlocks)

      // 2) Add missing fields from the template to the metadata blocks info for create
      const metadataBlocksInfoWithAddedFieldsFromTemplate =
        this.addFieldsFromTemplateToMetadataBlocksInfoForDisplayOnCreate(
          normalizedMetadataBlocksInfoForDisplayOnCreate,
          normalizedMetadataBlocksInfoForDisplayOnEdit,
          normalizedDatasetTemplateMetadataBlocksValues
        )
      // 3) Add the values from the template to the metadata blocks info for create
      const metadataBlocksInfoWithValuesFromTemplate = this.addFieldValuesToMetadataBlocksInfo(
        metadataBlocksInfoWithAddedFieldsFromTemplate,
        normalizedDatasetTemplateMetadataBlocksValues
      )

      // 5) Order fields by display order
      const metadataBlocksInfoOrdered = this.orderFieldsByDisplayOrder(
        metadataBlocksInfoWithValuesFromTemplate
      )

      return metadataBlocksInfoOrdered
    } else {
      // EDIT MODE
      const datasetCurrentValues = datasetMetadaBlocksCurrentValues as DatasetMetadataBlocks // In edit mode we always have current values

      // 1) Normalize dataset current values
      const normalizedDatasetMetadaBlocksCurrentValues =
        this.replaceDatasetMetadataBlocksDotKeysWithSlash(datasetCurrentValues)

      // 2) Add current values to the metadata blocks info for edit
      const metadataBlocksInfoWithCurrentValues = this.addFieldValuesToMetadataBlocksInfo(
        normalizedMetadataBlocksInfoForDisplayOnEdit,
        normalizedDatasetMetadaBlocksCurrentValues
      )

      // 3) Order fields by display order
      const metadataBlocksInfoOrdered = this.orderFieldsByDisplayOrder(
        metadataBlocksInfoWithCurrentValues
      )

      return metadataBlocksInfoOrdered
    }
  }

  public static addFieldsFromTemplateToMetadataBlocksInfoForDisplayOnCreate(
    metadataBlocksInfoForDisplayOnCreate: MetadataBlockInfo[],
    metadataBlocksInfoForDisplayOnEdit: MetadataBlockInfo[],
    templateFields: DatasetMetadataBlocks | undefined
  ): MetadataBlockInfo[] {
    if (!templateFields || templateFields.length === 0) {
      return metadataBlocksInfoForDisplayOnCreate
    }

    // Trabajamos sobre una copia
    const createCopy: MetadataBlockInfo[] = structuredClone(metadataBlocksInfoForDisplayOnCreate)

    // Mapas útiles
    const createMap = createCopy.reduce<Record<string, MetadataBlockInfo>>((acc, block) => {
      acc[block.name] = block
      return acc
    }, {})

    const editMap = metadataBlocksInfoForDisplayOnEdit.reduce<Record<string, MetadataBlockInfo>>(
      (acc, block) => {
        acc[block.name] = block
        return acc
      },
      {}
    )

    // Recorremos los bloques del template (el template solo trae valores)
    for (const tBlock of templateFields) {
      const blockName = tBlock.name
      const editBlock = editMap[blockName]
      if (!editBlock) {
        // No sabemos cómo luce este bloque en "edit", no podemos copiar su forma
        continue
      }

      // Aseguramos que el bloque exista en el array de "create"
      let createBlock = createMap[blockName]
      if (!createBlock) {
        createBlock = {
          id: editBlock.id,
          name: editBlock.name,
          displayName: editBlock.displayName,
          metadataFields: {},
          displayOnCreate: editBlock.displayOnCreate
        }
        createMap[blockName] = createBlock
        createCopy.push(createBlock)
      }

      const createFields = createBlock.metadataFields
      const editFields = editBlock.metadataFields

      // Por cada field que el template trae con valor, si no existe en "create", lo copiamos desde "edit"
      const templateBlockFields = tBlock.fields ?? {}
      for (const fieldName of Object.keys(templateBlockFields)) {
        if (createFields[fieldName]) continue

        const fieldFromEdit = editFields[fieldName]
        if (!fieldFromEdit) {
          // El field no existe ni en "edit": no hay forma de conocer su forma; lo saltamos
          continue
        }

        const clonedField = structuredClone(fieldFromEdit)

        createFields[fieldName] = clonedField
      }
    }

    return createCopy
  }

  private static orderFieldsByDisplayOrder(
    metadataBlocksInfo: MetadataBlockInfo[]
  ): MetadataBlockInfo[] {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const metadataBlocksInfoCopy: MetadataBlockInfo[] = structuredClone(metadataBlocksInfo)

    for (const block of metadataBlocksInfoCopy) {
      if (block.metadataFields) {
        const fieldsArray = Object.values(block.metadataFields)
        fieldsArray.sort((a, b) => a.displayOrder - b.displayOrder)

        const orderedFields: Record<string, MetadataField> = {}
        for (const field of fieldsArray) {
          orderedFields[field.name] = field
        }
        block.metadataFields = orderedFields
      }
    }
    return metadataBlocksInfoCopy
  }
}
