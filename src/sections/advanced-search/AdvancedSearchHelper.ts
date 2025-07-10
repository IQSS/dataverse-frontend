import {
  MetadataBlockInfo,
  MetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
// import { SearchFields } from '@/search/domain/models/SearchFields'

export class AdvancedSearchHelper {
  public static filterSearchableMetadataBlockFields(
    blocks: MetadataBlockInfo[]
  ): MetadataBlockInfo[] {
    return blocks.map((block) => {
      const flattenedFields: Record<string, MetadataField> = {}

      for (const field of Object.values(block.metadataFields)) {
        const { childMetadataFields, ...rest } = field

        const isCompound = field.typeClass === 'compound'
        const isSearchable = field.isAdvancedSearchFieldType

        if (!isCompound && isSearchable) {
          flattenedFields[field.name] = rest
        }

        // Always include child fields, if any
        if (childMetadataFields) {
          for (const [childKey, childField] of Object.entries(childMetadataFields)) {
            if (childField.isAdvancedSearchFieldType) {
              flattenedFields[childKey] = childField
            }
          }
        }
      }

      return {
        ...block,
        metadataFields: flattenedFields
      }
    })
  }
}
