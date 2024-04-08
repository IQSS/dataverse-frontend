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
