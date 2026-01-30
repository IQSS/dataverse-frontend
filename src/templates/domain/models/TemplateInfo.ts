import { type TypeClassMetadataField } from '@/metadata-block-info/domain/models/MetadataBlockInfo'

export interface TemplateInfo {
  name: string
  isDefault?: boolean
  fields?: TemplateFieldInfo[]
  instructions?: TemplateInstructionInfo[]
}

export interface TemplateFieldInfo {
  typeName: string
  multiple: boolean
  typeClass?: TypeClassMetadataField
  value?: TemplateFieldValue
}

export type TemplateFieldValue =
  | string
  | string[]
  | TemplateFieldCompoundValue
  | TemplateFieldCompoundValue[]

export type TemplateFieldCompoundValue = Record<string, TemplateFieldCompoundChildValue>

export interface TemplateFieldCompoundChildValue {
  value: string | string[]
  typeName: string
  multiple: boolean
  typeClass: TypeClassMetadataField
}

export interface TemplateInstructionInfo {
  instructionField: string
  instructionText: string
}
