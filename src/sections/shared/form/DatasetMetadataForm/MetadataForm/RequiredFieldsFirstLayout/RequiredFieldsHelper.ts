import {
  type MetadataBlockInfo,
  type MetadataField,
  TypeClassMetadataFieldOptions
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { type DatasetMetadataFormValues } from '../../MetadataFieldsHelper'

export interface RequiredFieldEntry {
  blockName: string
  blockDisplayName: string
  field: MetadataField
}

export interface RequiredFieldsSplit {
  stillNeeded: RequiredFieldEntry[]
  completed: RequiredFieldEntry[]
}

export interface RequiredFieldsBlockGroup {
  blockName: string
  blockDisplayName: string
  entries: RequiredFieldEntry[]
}

type FormRow = Record<string, unknown>

/**
 * Works out which fields of the metadata blocks are required, whether they hold a value, and which
 * control to focus to fill the next empty one. Only top-level fields are considered required; a
 * composed field (such as Author) counts as one required field whose required child fields
 * (such as Author Name) must be filled in every row.
 */
export class RequiredFieldsHelper {
  public static collectRequiredFields(
    metadataBlocksInfo: MetadataBlockInfo[]
  ): RequiredFieldEntry[] {
    return metadataBlocksInfo.flatMap((block) =>
      Object.values(block.metadataFields)
        .filter((field) => field.isRequired)
        .map((field) => ({ blockName: block.name, blockDisplayName: block.displayName, field }))
    )
  }

  public static getFormName(entry: RequiredFieldEntry): string {
    return `${entry.blockName}.${entry.field.name}`
  }

  public static getFormValue(
    entry: RequiredFieldEntry,
    values: DatasetMetadataFormValues
  ): unknown {
    return values[entry.blockName]?.[entry.field.name]
  }

  public static isFilled(field: MetadataField, value: unknown): boolean {
    if (field.typeClass === TypeClassMetadataFieldOptions.Compound) {
      const rows = this.toRows(value)
      if (rows.length === 0) return false

      const requiredChildFields = this.getRequiredChildFields(field)

      // A required composed field without required child fields just needs some value in it,
      // which is how Dataverse itself checks it
      if (requiredChildFields.length === 0) {
        return rows.some((row) => Object.values(row).some((childValue) => this.hasText(childValue)))
      }

      return rows.every((row) =>
        requiredChildFields.every((child) => this.hasText(row[child.name]))
      )
    }

    if (Array.isArray(value)) {
      return value.some((item) => this.hasText(this.getItemText(item)))
    }

    return this.hasText(value)
  }

  public static getFirstEmptyControlName(entry: RequiredFieldEntry, value: unknown): string {
    const formName = this.getFormName(entry)
    const { field } = entry

    if (field.typeClass === TypeClassMetadataFieldOptions.Compound) {
      const rows = this.toRows(value)
      const requiredChildFields = this.getRequiredChildFields(field)

      for (const [rowIndex, row] of rows.entries()) {
        const emptyChild = requiredChildFields.find((child) => !this.hasText(row[child.name]))
        if (emptyChild) return this.getChildControlName(formName, field, rowIndex, emptyChild.name)
      }

      const firstChild = requiredChildFields[0] ?? Object.values(field.childMetadataFields ?? {})[0]
      return firstChild ? this.getChildControlName(formName, field, 0, firstChild.name) : formName
    }

    if (field.typeClass === TypeClassMetadataFieldOptions.Primitive && field.multiple) {
      const items = Array.isArray(value) ? value : []
      const emptyIndex = items.findIndex((item) => !this.hasText(this.getItemText(item)))
      return `${formName}.${emptyIndex === -1 ? 0 : emptyIndex}.value`
    }

    return formName
  }

  public static splitByValues(
    entries: RequiredFieldEntry[],
    values: DatasetMetadataFormValues
  ): RequiredFieldsSplit {
    return entries.reduce<RequiredFieldsSplit>(
      (split, entry) => {
        const target = this.isFilled(entry.field, this.getFormValue(entry, values))
          ? split.completed
          : split.stillNeeded
        target.push(entry)
        return split
      },
      { stillNeeded: [], completed: [] }
    )
  }

  public static groupByBlock(entries: RequiredFieldEntry[]): RequiredFieldsBlockGroup[] {
    return entries.reduce<RequiredFieldsBlockGroup[]>((groups, entry) => {
      const group = groups.find((candidate) => candidate.blockName === entry.blockName)

      if (group) {
        group.entries.push(entry)
      } else {
        groups.push({
          blockName: entry.blockName,
          blockDisplayName: entry.blockDisplayName,
          entries: [entry]
        })
      }

      return groups
    }, [])
  }

  public static getOptionalFieldsBlocks(
    metadataBlocksInfo: MetadataBlockInfo[]
  ): MetadataBlockInfo[] {
    return metadataBlocksInfo
      .map((block) => ({
        ...block,
        metadataFields: Object.fromEntries(
          Object.entries(block.metadataFields).filter(([, field]) => !field.isRequired)
        )
      }))
      .filter((block) => Object.keys(block.metadataFields).length > 0)
  }

  public static getFieldTitles(metadataBlocksInfo: MetadataBlockInfo[]): string[] {
    return metadataBlocksInfo.flatMap((block) =>
      Object.values(block.metadataFields).map((field) => field.title)
    )
  }

  private static getRequiredChildFields(field: MetadataField): MetadataField[] {
    return Object.values(field.childMetadataFields ?? {}).filter((child) => child.isRequired)
  }

  private static getChildControlName(
    formName: string,
    field: MetadataField,
    rowIndex: number,
    childName: string
  ): string {
    return field.multiple ? `${formName}.${rowIndex}.${childName}` : `${formName}.${childName}`
  }

  private static toRows(value: unknown): FormRow[] {
    if (Array.isArray(value)) return value.filter((item) => this.isRow(item))
    return this.isRow(value) ? [value] : []
  }

  private static isRow(value: unknown): value is FormRow {
    return typeof value === 'object' && value !== null && !Array.isArray(value)
  }

  private static getItemText(item: unknown): unknown {
    return this.isRow(item) ? item.value : item
  }

  private static hasText(value: unknown): boolean {
    return typeof value === 'string' && value.trim() !== ''
  }
}
