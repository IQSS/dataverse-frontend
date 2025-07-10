import {
  MetadataBlockInfo,
  MetadataField,
  TypeClassMetadataFieldOptions
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import {
  AdvancedSearchFormData,
  CollectionsFields,
  FilesFields
} from './advanced-search-form/AdvancedSearchForm'
import { SearchFields } from '@/search/domain/models/SearchFields'
import { MetadataFieldsHelper } from '../shared/form/DatasetMetadataForm/MetadataFieldsHelper'

// TODO:ME - create function to transform collectionPageQuery to AdvancedSearchFormData

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

  public static getFormDefaultValues(metadataBlocks: MetadataBlockInfo[]): AdvancedSearchFormData {
    const searchableMetadataBlockFields = this.filterSearchableMetadataBlockFields(metadataBlocks)

    const flattenedMetadataFields: Record<string, string | string[]> = {}

    for (const block of searchableMetadataBlockFields) {
      for (const field of Object.values(block.metadataFields)) {
        const isControlledVocabulary =
          field.typeClass === TypeClassMetadataFieldOptions.ControlledVocabulary

        flattenedMetadataFields[field.name] = isControlledVocabulary ? [] : ''
      }
    }

    return {
      collections: {
        [SearchFields.DATAVERSE_NAME]: '',
        [SearchFields.DATAVERSE_ALIAS]: '',
        [SearchFields.DATAVERSE_AFFILIATION]: '',
        [SearchFields.DATAVERSE_DESCRIPTION]: '',
        [SearchFields.DATAVERSE_SUBJECT]: []
      },
      datasets: {
        ...flattenedMetadataFields
      },
      files: {
        [SearchFields.FILE_NAME]: '',
        [SearchFields.FILE_DESCRIPTION]: '',
        [SearchFields.FILE_TYPE_SEARCHABLE]: '',
        [SearchFields.FILE_PERSISTENT_ID]: '',
        [SearchFields.VARIABLE_NAME]: '',
        [SearchFields.VARIABLE_LABEL]: '',
        [SearchFields.FILE_TAG_SEARCHABLE]: ''
      }
    }
  }

  public static constructSearchQuery(formData: AdvancedSearchFormData): string {
    const collectionQuery = this.constructCollectionQuery(formData.collections)
    const datasetQuery = this.constructDatasetQuery(formData.datasets)
    const fileQuery = this.constructFileQuery(formData.files)

    const queries: string[] = []

    if (collectionQuery) {
      queries.push(collectionQuery)
    }

    if (datasetQuery) {
      queries.push(datasetQuery)
    }

    if (fileQuery) {
      queries.push(fileQuery)
    }

    const query = this.constructQuery(queries, false, false)

    return query
  }

  private static constructCollectionQuery(fields: CollectionsFields): string {
    const queryStrings: string[] = []

    if (fields[SearchFields.DATAVERSE_NAME]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.DATAVERSE_NAME,
          fields[SearchFields.DATAVERSE_NAME].trim()
        )
      )
    }

    if (fields[SearchFields.DATAVERSE_ALIAS]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.DATAVERSE_ALIAS,
          fields[SearchFields.DATAVERSE_ALIAS].trim()
        )
      )
    }

    if (fields[SearchFields.DATAVERSE_AFFILIATION]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.DATAVERSE_AFFILIATION,
          fields[SearchFields.DATAVERSE_AFFILIATION].trim()
        )
      )
    }

    if (fields[SearchFields.DATAVERSE_DESCRIPTION]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.DATAVERSE_DESCRIPTION,
          fields[SearchFields.DATAVERSE_DESCRIPTION].trim()
        )
      )
    }

    if (fields[SearchFields.DATAVERSE_SUBJECT].length > 0) {
      const subjectQueries = fields[SearchFields.DATAVERSE_SUBJECT].map(
        (value) => `${SearchFields.DATAVERSE_SUBJECT}:"${value}"`
      )
      queryStrings.push(this.constructQuery(subjectQueries, false))
    }

    return this.constructQuery(queryStrings, true)
  }

  private static constructFileQuery(fields: FilesFields): string {
    const queryStrings: string[] = []

    if (fields[SearchFields.FILE_NAME]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(SearchFields.FILE_NAME, fields[SearchFields.FILE_NAME].trim())
      )
    }

    if (fields[SearchFields.FILE_DESCRIPTION]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.FILE_DESCRIPTION,
          fields[SearchFields.FILE_DESCRIPTION].trim()
        )
      )
    }

    if (fields[SearchFields.FILE_TYPE_SEARCHABLE]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.FILE_TYPE_SEARCHABLE,
          fields[SearchFields.FILE_TYPE_SEARCHABLE].trim()
        )
      )
    }

    if (fields[SearchFields.FILE_PERSISTENT_ID]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.FILE_PERSISTENT_ID,
          fields[SearchFields.FILE_PERSISTENT_ID].trim()
        )
      )
    }

    if (fields[SearchFields.VARIABLE_NAME]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.VARIABLE_NAME,
          fields[SearchFields.VARIABLE_NAME].trim()
        )
      )
    }

    if (fields[SearchFields.VARIABLE_LABEL]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.VARIABLE_LABEL,
          fields[SearchFields.VARIABLE_LABEL].trim()
        )
      )
    }

    if (fields[SearchFields.FILE_TAG_SEARCHABLE]?.trim()) {
      queryStrings.push(
        this.constructFieldQuery(
          SearchFields.FILE_TAG_SEARCHABLE,
          fields[SearchFields.FILE_TAG_SEARCHABLE].trim()
        )
      )
    }

    return this.constructQuery(queryStrings, true)
  }

  private static constructDatasetQuery(fields: Record<string, string | string[]>) {
    const queryStrings: string[] = []

    for (const [field, value] of Object.entries(fields)) {
      // Replace back again slashes with dots
      const originalField = MetadataFieldsHelper.replaceSlashWithDot(field)

      if (Array.isArray(value) && value.length > 0) {
        const arrayQueries = value.map((value) => `${originalField}:"${value}"`)
        queryStrings.push(this.constructQuery(arrayQueries, false))
      } else if (typeof value === 'string' && value.trim()) {
        queryStrings.push(this.constructFieldQuery(originalField, value.trim()))
      }
    }

    return this.constructQuery(queryStrings, true)
  }

  private static constructQuery(
    queryStrings: string[],
    isAnd: boolean,
    surroundWithParens = true
  ): string {
    const nonEmpty = queryStrings.filter((str) => str.trim() !== '')

    if (nonEmpty.length === 0) return ''

    const combined = nonEmpty.join(isAnd ? ' AND ' : ' OR ')

    return surroundWithParens && nonEmpty.length > 1 ? `(${combined})` : combined
  }

  private static constructFieldQuery(field: string, value: string): string {
    if (!value.trim()) return ''
    const words = value.trim().split(' ')

    if (words.length === 1) {
      return `${field}:${words[0]}`
    }
    const joinedWords = words.map((word) => `${field}:${word}`).join(' ')

    return `(${joinedWords})`
  }
}
