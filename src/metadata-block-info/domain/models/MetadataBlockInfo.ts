import type { TFunction } from 'i18next'

import { DatasetMetadataFieldValue } from '../../../dataset/domain/models/Dataset'

export interface MetadataBlockInfo {
  id: number
  name: string
  displayName: string
  metadataFields: Record<string, MetadataField>
  displayOnCreate: boolean
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
  isAdvancedSearchFieldType: boolean
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

export interface MetadataBlockInfoDisplayFormat {
  name: string
  displayName: string
  fields: MetadataBlockInfoDisplayFormatFields
}

export type MetadataBlockInfoDisplayFormatFields = Record<string, MetadataFieldInfo>

export type MetadataFieldInfo = Pick<
  MetadataField,
  'displayFormat' | 'title' | 'type' | 'description'
>

export const METADATA_FIELD_DISPLAY_FORMAT_PLACEHOLDER = '#VALUE'
export const METADATA_FIELD_DISPLAY_FORMAT_NAME_PLACEHOLDER = '#NAME'

export const PUBLICATION_RELATION_TYPE_FIELD_NAME = 'publicationRelationType'
export const PUBLICATION_RELATION_TYPE_VALUES = [
  'IsCitedBy',
  'Cites',
  'IsSupplementTo',
  'IsSupplementedBy',
  'IsReferencedBy',
  'References'
] as const

export function getPublicationRelationLabel(value: string, t: TFunction): string {
  if (!PUBLICATION_RELATION_TYPE_VALUES.some((relationType) => relationType === value)) {
    return value
  }

  return t(`publicationRelationTypes.${value}`)
}
