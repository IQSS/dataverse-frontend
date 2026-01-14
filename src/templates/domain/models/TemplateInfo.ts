import {
  TypeClassMetadataFieldOptions,
  type TypeClassMetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'

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
  value?: TemplateFieldValueInfo[]
}

export interface TemplateFieldValueInfo {
  [key: string]:
    | TemplateFieldValuePrimitiveInfo
    | TemplateFieldValueCompoundInfo
    | TemplateFieldValueControlledVocabularyInfo
}

export interface TemplateFieldValuePrimitiveInfo {
  typeName: string
  typeClass: typeof TypeClassMetadataFieldOptions.Primitive
  value: string | string[]
}

export interface TemplateFieldValueCompoundInfo {
  typeName: string
  typeClass: typeof TypeClassMetadataFieldOptions.Compound
  value: TemplateFieldValueInfo[]
}

export interface TemplateFieldValueControlledVocabularyInfo {
  typeName: string
  typeClass: typeof TypeClassMetadataFieldOptions.ControlledVocabulary
  value: string
}

export interface TemplateInstructionInfo {
  instructionField: string
  instructionText: string
}
