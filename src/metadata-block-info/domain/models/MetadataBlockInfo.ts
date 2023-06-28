export interface MetadataBlockInfo {
  name: string
  fields: Record<string, MetadataFieldInfo>
}

export interface MetadataFieldInfo {
  displayFormat: string
}

export const METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER = '#VALUE'
