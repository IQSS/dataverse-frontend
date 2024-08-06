import { CollectionInputLevel } from '../../../collection/domain/models/Collection'
import {
  CollectionDTO,
  CollectionInputLevelDTO
} from '../../../collection/domain/useCases/DTOs/CollectionDTO'
import { MetadataBlockName } from '../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { ReducedMetadataBlockInfo, ReducedMetadataFieldInfo } from '../useGetAllMetadataBlocksInfo'
import {
  CollectionFormMetadataBlock,
  CollectionFormMetadataBlocks,
  CONDITIONALLY_REQUIRED_FIELDS,
  FormattedCollectionInputLevels,
  FormattedCollectionInputLevelsWithoutParentBlockName
} from './CollectionForm'

export class CollectionFormHelper {
  public static replaceDotWithSlash = (str: string) => str.replace(/\./g, '/')

  public static replaceSlashWithDot = (str: string) => str.replace(/\//g, '.')

  public static defineBaseInputLevels(
    allMetadataBlocksInfoReduced: ReducedMetadataBlockInfo[]
  ): FormattedCollectionInputLevels {
    const fields: FormattedCollectionInputLevels = {}
    const childFields: FormattedCollectionInputLevels = {}

    allMetadataBlocksInfoReduced.forEach((block) => {
      Object.entries(block.metadataFields).forEach(([_key, field]) => {
        const normalizedFieldName = this.replaceDotWithSlash(field.name)
        const isFieldRequiredByDataverse = field.isRequired
        const isAConditionallyRequiredField = CONDITIONALLY_REQUIRED_FIELDS.includes(field.name)

        fields[normalizedFieldName] = {
          include: true,
          optionalOrRequired:
            isFieldRequiredByDataverse && !isAConditionallyRequiredField ? 'required' : 'optional',
          parentBlockName: block.name as CollectionFormMetadataBlock
        }

        if (field.childMetadataFields) {
          Object.entries(field.childMetadataFields).forEach(([_key, childField]) => {
            const normalizedFieldName = this.replaceDotWithSlash(childField.name)
            const isChildFieldRequiredByDataverse = childField.isRequired
            const isAConditionallyRequiredChildField = CONDITIONALLY_REQUIRED_FIELDS.includes(
              childField.name
            )

            childFields[normalizedFieldName] = {
              include: true,
              optionalOrRequired:
                isChildFieldRequiredByDataverse && !isAConditionallyRequiredChildField
                  ? 'required'
                  : 'optional',
              parentBlockName: block.name as CollectionFormMetadataBlock
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

  public static separateMetadataBlocksInfoByNames(
    allMetadataBlocksInfo: ReducedMetadataBlockInfo[]
  ): {
    citationBlock: ReducedMetadataBlockInfo
    geospatialBlock: ReducedMetadataBlockInfo
    socialScienceBlock: ReducedMetadataBlockInfo
    astrophysicsBlock: ReducedMetadataBlockInfo
    biomedicalBlock: ReducedMetadataBlockInfo
    journalBlock: ReducedMetadataBlockInfo
  } {
    const citationBlock: ReducedMetadataBlockInfo = allMetadataBlocksInfo.find(
      (block) => block.name === MetadataBlockName.CITATION
    ) as ReducedMetadataBlockInfo

    const geospatialBlock: ReducedMetadataBlockInfo = allMetadataBlocksInfo.find(
      (block) => block.name === MetadataBlockName.GEOSPATIAL
    ) as ReducedMetadataBlockInfo

    const socialScienceBlock: ReducedMetadataBlockInfo = allMetadataBlocksInfo.find(
      (block) => block.name === MetadataBlockName.SOCIAL_SCIENCE
    ) as ReducedMetadataBlockInfo

    const astrophysicsBlock: ReducedMetadataBlockInfo = allMetadataBlocksInfo.find(
      (block) => block.name === MetadataBlockName.ASTROPHYSICS
    ) as ReducedMetadataBlockInfo

    const biomedicalBlock: ReducedMetadataBlockInfo = allMetadataBlocksInfo.find(
      (block) => block.name === MetadataBlockName.BIOMEDICAL
    ) as ReducedMetadataBlockInfo

    const journalBlock: ReducedMetadataBlockInfo = allMetadataBlocksInfo.find(
      (block) => block.name === MetadataBlockName.JOURNAL
    ) as ReducedMetadataBlockInfo

    return {
      citationBlock,
      geospatialBlock,
      socialScienceBlock,
      astrophysicsBlock,
      biomedicalBlock,
      journalBlock
    }
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
    childMetadataFields: Record<string, ReducedMetadataFieldInfo>,
    targetChildFieldName: string
  ): Record<string, ReducedMetadataFieldInfo> => {
    return Object.entries(childMetadataFields)
      .filter(([_key, { name }]) => name !== targetChildFieldName)
      .reduce((acc, [key, field]) => {
        acc[key] = field
        return acc
      }, {} as Record<string, ReducedMetadataFieldInfo>)
  }
}
