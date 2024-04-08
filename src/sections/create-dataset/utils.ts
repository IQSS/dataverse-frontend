import { FieldValues } from 'react-hook-form'
import {
  MetadataBlockInfo2,
  MetadataField2
} from '../../metadata-block-info/domain/models/MetadataBlockInfo'

function dotReplacer(metadataFields: Record<string, MetadataField2> | undefined) {
  if (!metadataFields) return

  for (const key in metadataFields) {
    const field = metadataFields[key]
    if (field.name.includes('.')) {
      field.name = field.name.replace(/\./g, '/')
    }
    if (field.childMetadataFields) {
      dotReplacer(field.childMetadataFields)
    }
  }
}
// To replace all field names properties that contain a dot with a slash, to avoid nesting objects in the form
export function replaceDotKeysWithSlash(
  metadataBlocks: MetadataBlockInfo2[]
): MetadataBlockInfo2[] {
  for (const block of metadataBlocks) {
    if (block.metadataFields) {
      dotReplacer(block.metadataFields)
    }
  }
  return metadataBlocks
}

interface NestedObject {
  [key: string]: unknown
}
// To replace all saved form field names that contain a slash with a dot, turn them back to the original format
export function replaceSlashKeysWithDot<T extends NestedObject>(obj: T): T {
  const newObj: [] | object = Array.isArray(obj) ? [] : {}

  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      const newKey = key.replace(/\//g, '.')
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      newObj[newKey] =
        typeof obj[key] === 'object' ? replaceSlashKeysWithDot(obj[key] as NestedObject) : obj[key]
    }
  }

  return newObj as T
}

/**
 *  To format form values object to match create dataset DTO structure
 * @param formValues The form values object
 * @returns The formatted object
 * @example
 * @input const formValues = {
    citation: {
      title: 'Title',
      author: { authorName: 'Author Name' }
    },
    astrophysics: {
      'coverage.Temporal': { 'coverage.Temporal.startDate': '2021-01-01', 'coverage.Temporal.endDate': '2021-01-02' }
    }
  }
  @output {
    metadataBlocks: [
      {
        name: 'citation',
        fields: {
          title: 'Title',
          author: [{ authorName: 'Author Name' }]
        }
      },
      {
        name: 'astrophysics',
        fields: {
          'coverage.Temporal': [
            'coverage.Temporal.startDate': '2021-01-01',
            'coverage.Temporal.endDate': '2021-01-02'
          ]
        }
      }
    ]
*/
interface CreateDatasetDTO {
  metadataBlocks: MetadataBlockDTO[]
}
interface MetadataBlockDTO {
  name: string
  fields: Record<string, SupportedFieldValue | Record<string, SupportedFieldValue>[]>
}
type SupportedFieldValue = string | number | string[] | number[] | undefined

export function formatFormValuesToCreateDatasetDTO(formValues: FieldValues): CreateDatasetDTO {
  const metadataBlocks: CreateDatasetDTO['metadataBlocks'] = []

  for (const metadataBlockName in formValues) {
    const formattedMetadataBlock: MetadataBlockDTO = {
      name: metadataBlockName,
      fields: {}
    }

    Object.entries(formValues[metadataBlockName] as object).forEach(
      ([fieldName, fieldValue]: [fieldName: string, fieldValue: MetadataBlockDTO['fields']]) => {
        // If undefined means that the field was not filled, undefined is the default value that forms give to empty fields
        if (fieldValue === undefined) {
          formattedMetadataBlock.fields[fieldName] = undefined
        }

        // If primitive value, just assign it
        if (typeof fieldValue === 'string' || typeof fieldValue === 'number') {
          formattedMetadataBlock.fields[fieldName] = fieldValue
        }

        // If array, just assign it
        if (Array.isArray(fieldValue)) {
          formattedMetadataBlock.fields[fieldName] = fieldValue
        }

        // If object, assign it as an array of objects for every property inside of it
        if (typeof fieldValue === 'object' && !Array.isArray(fieldValue) && fieldValue !== null) {
          const nestedFieldValues: Record<string, SupportedFieldValue>[] = []
          for (const nestedKey in fieldValue) {
            // Here we need to make same checks as above, but for nested fields except the nested object check
            const nestedFieldValue = fieldValue[nestedKey]

            // If undefined means that the field was not filled, undefined is the default value that forms give to empty fields
            if (nestedFieldValue === undefined) {
              nestedFieldValues.push({ [nestedKey]: undefined })
            }

            // If primitive value, just assign it
            if (typeof nestedFieldValue === 'string' || typeof nestedFieldValue === 'number') {
              nestedFieldValues.push({ [nestedKey]: nestedFieldValue })
            }

            // If array, just assign it
            if (Array.isArray(nestedFieldValue)) {
              nestedFieldValues.push({ [nestedKey]: nestedFieldValue as string[] | number[] })
            }
          }
          formattedMetadataBlock.fields[fieldName] = nestedFieldValues
        }
      }
    )

    metadataBlocks.push(formattedMetadataBlock)
  }

  return { metadataBlocks }
}
