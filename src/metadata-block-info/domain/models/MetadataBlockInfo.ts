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

// 👇👇 New types for #336

export interface MetadataBlockInfo2 {
  id: number
  name: string
  displayName: string
  metadataFields: Record<string, MetadataField2>
  displayOnCreate?: boolean // If true, the block will be displayed on the create dataset form
}

export interface MetadataField2 {
  name: string
  displayName: string
  title: string
  type: TypeMetadataField
  typeClass: TypeClassMetadataField
  watermark: WatermarkMetadataField
  description: string
  multiple: boolean
  isControlledVocabulary: boolean
  displayFormat: string
  isRequired: boolean
  displayOrder: number
  controlledVocabularyValues?: string[]
  childMetadataFields?: Record<string, MetadataField2>
  displayOnCreate?: boolean // If true, the field will be displayed on the create metadata block
}

export enum TypeMetadataField {
  Date = 'DATE',
  Email = 'EMAIL',
  Float = 'FLOAT',
  Int = 'INT',
  None = 'NONE',
  Text = 'TEXT',
  Textbox = 'TEXTBOX',
  URL = 'URL'
}

export enum TypeClassMetadataField {
  Compound = 'compound',
  ControlledVocabulary = 'controlledVocabulary',
  Primitive = 'primitive'
}

export enum WatermarkMetadataField {
  Empty = '',
  EnterAFloatingPointNumber = 'Enter a floating-point number.',
  EnterAnInteger = 'Enter an integer.',
  FamilyNameGivenNameOrOrganization = 'FamilyName, GivenName or Organization',
  HTTPS = 'https://',
  NameEmailXyz = 'name@email.xyz',
  OrganizationXYZ = 'Organization XYZ',
  The1FamilyNameGivenNameOr2Organization = '1) FamilyName, GivenName or 2) Organization',
  The1FamilyNameGivenNameOr2OrganizationXYZ = '1) Family Name, Given Name or 2) Organization XYZ',
  WatermarkEnterAnInteger = 'Enter an integer...',
  YYYYOrYYYYMMOrYYYYMMDD = 'YYYY or YYYY-MM or YYYY-MM-DD',
  YyyyMmDD = 'YYYY-MM-DD'
}
