import { ReducedMetadataBlockInfo } from '../useGetAllMetadataBlocksInfoByName'
import { FormattedCollectionInputLevels } from './CollectionForm'

export class CollectionFormHelper {
  public static replaceDotWithSlash = (str: string) => str.replace(/\./g, '/')

  public static replaceSlashWithDot = (str: string) => str.replace(/\//g, '.')

  public static getFormBaseInputLevels(
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
}
