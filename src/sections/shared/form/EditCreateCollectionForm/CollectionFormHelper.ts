import {
  MetadataBlockInfo,
  MetadataField,
  TypeClassMetadataFieldOptions
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { CollectionInputLevel } from '@/collection/domain/models/CollectionInputLevel'
import {
  CollectionDTO,
  CollectionInputLevelDTO
} from '@/collection/domain/useCases/DTOs/CollectionDTO'
import { CollectionContact } from '@/collection/domain/models/CollectionContact'
import {
  CollectionFormContactValue,
  CollectionFormDirtyFields,
  CollectionFormMetadataBlocks,
  FormattedCollectionInputLevels,
  FormattedCollectionInputLevelsWithoutParentBlockName,
  MetadataFieldWithParentBlockInfo
} from './types'

export class CollectionFormHelper {
  public static replaceDotWithSlash = (str: string) => str.replace(/\./g, '/')

  public static replaceSlashWithDot = (str: string) => str.replace(/\//g, '.')

  public static defineBaseInputLevels(
    allMetadataBlocksInfo: MetadataBlockInfo[]
  ): FormattedCollectionInputLevels {
    const fields: FormattedCollectionInputLevels = {}
    const childFields: FormattedCollectionInputLevels = {}

    allMetadataBlocksInfo.forEach((block) => {
      Object.entries(block.metadataFields).forEach(([_key, field]) => {
        const { name, isRequired, childMetadataFields, typeClass } = field
        const normalizedFieldName = this.replaceDotWithSlash(name)
        const isFieldRequiredByDataverse = isRequired

        const isSafeCompound =
          typeClass === TypeClassMetadataFieldOptions.Compound &&
          childMetadataFields !== undefined &&
          Object.keys(childMetadataFields).length > 0

        const composedFieldNotRequiredWithChildFieldsRequired =
          isSafeCompound &&
          !isRequired &&
          Object.keys(childMetadataFields).some((key) => childMetadataFields[key].isRequired)

        fields[normalizedFieldName] = {
          include: true,
          optionalOrRequired:
            isFieldRequiredByDataverse && !composedFieldNotRequiredWithChildFieldsRequired
              ? 'required'
              : 'optional',
          parentBlockName: block.name
        }

        if (field.childMetadataFields) {
          Object.entries(field.childMetadataFields).forEach(([_key, childField]) => {
            const normalizedFieldName = this.replaceDotWithSlash(childField.name)
            const isChildFieldRequiredByDataverse = childField.isRequired

            const isAConditionallyRequiredChildField =
              composedFieldNotRequiredWithChildFieldsRequired && childField.isRequired

            childFields[normalizedFieldName] = {
              include: true,
              optionalOrRequired:
                isChildFieldRequiredByDataverse && !isAConditionallyRequiredChildField
                  ? 'required'
                  : 'optional',
              parentBlockName: block.name
            }
          })
        }
      })
    })

    return {
      ...fields,
      ...childFields
    }
  }

  public static formatCollectiontInputLevels(
    collectionInputLevels: CollectionInputLevel[] | undefined
  ): FormattedCollectionInputLevelsWithoutParentBlockName {
    const result: FormattedCollectionInputLevelsWithoutParentBlockName = {}

    if (!collectionInputLevels) {
      return result
    }

    collectionInputLevels.forEach((level) => {
      const { datasetFieldName, include, required } = level
      const replaceDotWithSlash = (str: string) => str.replace(/\./g, '/')
      const normalizedFieldName = replaceDotWithSlash(datasetFieldName)

      result[normalizedFieldName] = {
        include,
        optionalOrRequired: required ? 'required' : 'optional'
      }
    })
    return result
  }

  public static mergeBaseAndDefaultInputLevels(
    baseInputLevels: FormattedCollectionInputLevels,
    formattedCollectionInputLevels: FormattedCollectionInputLevelsWithoutParentBlockName
  ): FormattedCollectionInputLevels {
    const result: FormattedCollectionInputLevels = { ...baseInputLevels }

    for (const key in formattedCollectionInputLevels) {
      if (baseInputLevels[key]) {
        result[key] = {
          ...baseInputLevels[key],
          ...formattedCollectionInputLevels[key],
          parentBlockName: baseInputLevels[key].parentBlockName
        }
      }
    }

    return result
  }

  public static formatFormMetadataBlockNamesToMetadataBlockNamesDTO(
    formMetadataBlockNames: CollectionFormMetadataBlocks
  ): string[] {
    const result: CollectionDTO['metadataBlockNames'] = []

    Object.entries(formMetadataBlockNames).forEach(([key, value]) => {
      if (value) {
        result.push(key)
      }
    })

    return result
  }

  public static formatFormInputLevelsToInputLevelsDTO(
    metadataBlockNamesSelected: string[],
    formCollectionInputLevels: FormattedCollectionInputLevels
  ): CollectionInputLevelDTO[] {
    const normalizedInputLevels =
      this.replaceSlashBackToDotsFromInputLevels(formCollectionInputLevels)

    const result: CollectionInputLevelDTO[] = []

    Object.entries(normalizedInputLevels).forEach(([key, value]) => {
      if (metadataBlockNamesSelected.includes(value.parentBlockName)) {
        result.push({
          datasetFieldName: key,
          include: value.include,
          required: value.optionalOrRequired === 'required'
        })
      }
    })

    return result
  }

  private static replaceSlashBackToDotsFromInputLevels(
    inputLevels: FormattedCollectionInputLevels
  ): FormattedCollectionInputLevels {
    const result: FormattedCollectionInputLevels = {}

    Object.entries(inputLevels).forEach(([key, value]) => {
      const replaceSlashWithDot = (str: string) => str.replace(/\//g, '.')
      const normalizedFieldName = replaceSlashWithDot(key)

      result[normalizedFieldName] = value
    })

    return result
  }

  public static getChildFieldSiblings = (
    childMetadataFields: Record<string, MetadataField>,
    targetChildFieldName: string
  ): Record<string, MetadataField> => {
    return Object.entries(childMetadataFields)
      .filter(([_key, { name }]) => name !== targetChildFieldName)
      .reduce((acc, [key, field]) => {
        acc[key] = field
        return acc
      }, {} as Record<string, MetadataField>)
  }

  public static assignBlockInfoToFacetableMetadataFields(
    facetableMetadataFields: MetadataField[],
    allMetadataBlocksInfo: MetadataBlockInfo[]
  ): MetadataFieldWithParentBlockInfo[] {
    const blockInfoMap = allMetadataBlocksInfo.reduce((acc, block) => {
      Object.keys(block.metadataFields).forEach((fieldName) => {
        acc[fieldName] = block
      })

      Object.values(block.metadataFields).forEach((metadataField) => {
        if (metadataField.childMetadataFields) {
          Object.keys(metadataField.childMetadataFields).forEach((childFieldName) => {
            acc[childFieldName] = block
          })
        }
      })

      return acc
    }, {} as Record<string, MetadataBlockInfo>)

    return facetableMetadataFields.map((field) => {
      const parentBlockInfo = blockInfoMap[field.name]

      return {
        ...field,
        parentBlockInfo: {
          id: parentBlockInfo.id,
          name: parentBlockInfo.name,
          displayName: parentBlockInfo.displayName
        }
      }
    })
  }

  public static formatCollectionContactsToFormContacts(
    collectionContacts: CollectionContact[]
  ): CollectionFormContactValue[] {
    if (collectionContacts.length === 0) {
      return [{ value: '' }]
    }

    return collectionContacts.map((contact) => ({
      value: contact.email
    }))
  }

  public static defineShouldCheckUseFromParent(
    onEditMode: boolean,
    isEditingRootCollection: boolean,
    isMetadataBlockOrFacetRoot?: boolean
  ): boolean {
    if (onEditMode) {
      if (isEditingRootCollection) {
        return false
      } else {
        return !isMetadataBlockOrFacetRoot
      }
    } else {
      return true
    }
  }

  public static getModifiedInputLevelValuesOnly(
    inputLevelDirtyFields: CollectionFormDirtyFields['inputLevels'],
    formCollectionInputLevels: FormattedCollectionInputLevels
  ): FormattedCollectionInputLevels {
    const modifiedValues: FormattedCollectionInputLevels = {}

    for (const key in inputLevelDirtyFields) {
      if (Object.hasOwn(inputLevelDirtyFields, key)) {
        modifiedValues[key] = formCollectionInputLevels[key]
      }
    }

    return modifiedValues
  }
}
