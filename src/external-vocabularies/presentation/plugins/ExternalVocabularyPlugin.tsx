import { ComponentType, ReactNode } from 'react'
import { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'
import { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'
import { DatasetMetadataFieldValue } from '@/dataset/domain/models/Dataset'
import { MetadataBlockInfoDisplayFormat } from '@/metadata-block-info/domain/models/MetadataBlockInfo'

export interface ExternalVocabularyFormFieldPluginProps {
  name: string
  title: string
  description: string
  watermark: string
  requiredIndicator: boolean
  externalVocabulary: ExternalVocabularyConfig
  builtFieldName: string
  metadataBlockName: string
  compoundParentName?: string
  fieldsArrayIndex?: number
  withinMultipleFieldsGroup: boolean
  value: string
  onChange: (value: string) => void
  invalid: boolean
  errorMessage?: string
}

export interface ExternalVocabularyDisplayValuePluginProps {
  metadataFieldName: string
  metadataFieldValue: DatasetMetadataFieldValue
  metadataBlockDisplayFormatInfo: MetadataBlockInfoDisplayFormat
  externalVocabulary: ExternalVocabularyConfig
}

export interface ExternalVocabularyTermDisplay {
  label: ReactNode
  caption?: ReactNode
  badge?: ReactNode
}

export interface ExternalVocabularyPlugin {
  id: string
  matches: (externalVocabulary: ExternalVocabularyConfig) => boolean
  FormField?: ComponentType<ExternalVocabularyFormFieldPluginProps>
  DisplayValue?: ComponentType<ExternalVocabularyDisplayValuePluginProps>
  formatTerm?: (
    term: ExternalVocabularyTerm,
    externalVocabulary: ExternalVocabularyConfig
  ) => ExternalVocabularyTermDisplay
  searchTerms?: (
    query: string,
    vocabulary: string,
    language: string,
    externalVocabulary: ExternalVocabularyConfig
  ) => Promise<ExternalVocabularyTerm[] | undefined>
  getManagedFieldValue?: (
    term: ExternalVocabularyTerm,
    managedKey: string,
    externalVocabulary: ExternalVocabularyConfig
  ) => string | undefined
}
