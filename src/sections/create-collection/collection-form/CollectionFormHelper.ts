import { CollectionInputLevel } from '../../../collection/domain/models/Collection'
import { ReducedMetadataBlockInfo } from '../useGetAllMetadataBlocksInfoByName'
import { FormattedCollectionInputLevels } from './CollectionForm'

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

        fields[normalizedFieldName] = {
          include: true,
          optionalOrRequired: 'optional'
        }

        if (field.childMetadataFields) {
          Object.entries(field.childMetadataFields).forEach(([_key, childField]) => {
            const normalizedFieldName = this.replaceDotWithSlash(childField.name)
            childFields[normalizedFieldName] = {
              include: true,
              optionalOrRequired: 'optional'
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
  ): FormattedCollectionInputLevels {
    const result: FormattedCollectionInputLevels = {}

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
}
