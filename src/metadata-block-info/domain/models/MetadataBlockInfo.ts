export interface MetadataBlockInfo {
  name: string
  fields: MetadataBlockInfoFields
}

export type MetadataBlockInfoFields = Record<string, MetadataFieldInfo>

export interface MetadataFieldInfo {
  displayFormat: string
}

export const METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER = '#VALUE'
export const METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER = '#NAME'
