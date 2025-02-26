import { DatasetMetadataFieldValue } from '../../../dataset/domain/models/Dataset'

export interface MetadataBlockInfo {
  id: number
  name: string
  displayName: string
  metadataFields: Record<string, MetadataField>
  displayOnCreate: boolean
}

export enum MetadataBlockName {
  CITATION = 'citation',
  GEOSPATIAL = 'geospatial',
  ASTROPHYSICS = 'astrophysics',
  BIOMEDICAL = 'biomedical',
  CODE_META = 'codeMeta20',
  COMPUTATIONAL_WORKFLOW = 'computationalworkflow',
  JOURNAL = 'journal',
  SOCIAL_SCIENCE = 'socialscience'
}

export interface MetadataBlockInfoWithMaybeValues extends MetadataBlockInfo {
  metadataFields: Record<string, MetadataFieldWithMaybeValue>
}

export interface MetadataField {
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
  childMetadataFields?: Record<string, MetadataField>
  displayOnCreate: boolean
}

export interface MetadataFieldWithMaybeValue extends MetadataField {
  value?: DatasetMetadataFieldValue
}

export const TypeMetadataFieldOptions = {
  Date: 'DATE',
  Email: 'EMAIL',
  Float: 'FLOAT',
  Int: 'INT',
  None: 'NONE',
  Text: 'TEXT',
  Textbox: 'TEXTBOX',
  URL: 'URL'
} as const

export type TypeMetadataField =
  (typeof TypeMetadataFieldOptions)[keyof typeof TypeMetadataFieldOptions]

export const TypeClassMetadataFieldOptions = {
  Compound: 'compound',
  ControlledVocabulary: 'controlledVocabulary',
  Primitive: 'primitive'
} as const

export type TypeClassMetadataField =
  (typeof TypeClassMetadataFieldOptions)[keyof typeof TypeClassMetadataFieldOptions]

export const WatermarkMetadataFieldOptions = {
  Empty: '',
  EnterAFloatingPointNumber: 'Enter a floating-point number.',
  EnterAnInteger: 'Enter an integer.',
  FamilyNameGivenNameOrOrganization: 'FamilyName, GivenName or Organization',
  HTTPS: 'https://',
  NameEmailXyz: 'name@email.xyz',
  OrganizationXYZ: 'Organization XYZ',
  The1FamilyNameGivenNameOr2Organization: '1) FamilyName, GivenName or 2) Organization',
  The1FamilyNameGivenNameOr2OrganizationXYZ: '1) Family Name, Given Name or 2) Organization XYZ',
  WatermarkEnterAnInteger: 'Enter an integer...',
  YYYYOrYYYYMMOrYYYYMMDD: 'YYYY or YYYY-MM or YYYY-MM-DD',
  YyyyMmDD: 'YYYY-MM-DD'
} as const

export type WatermarkMetadataField =
  (typeof WatermarkMetadataFieldOptions)[keyof typeof WatermarkMetadataFieldOptions]

export const DateFormatsOptions = {
  YYYY: 'YYYY',
  YYYYMM: 'YYYY-MM',
  YYYYMMDD: 'YYYY-MM-DD'
} as const

export type DateFormats = (typeof DateFormatsOptions)[keyof typeof DateFormatsOptions]

export interface MetadataBlockInfoDisplayFormat {
  name: string
  fields: MetadataBlockInfoDisplayFormatFields
}

export type MetadataBlockInfoDisplayFormatFields = Record<string, MetadataFieldInfo>

export type MetadataFieldInfo = Pick<MetadataField, 'displayFormat' | 'type'>

export const METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER = '#VALUE'
export const METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER = '#NAME'
