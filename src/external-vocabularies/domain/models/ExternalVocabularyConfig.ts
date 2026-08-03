import type { ExternalVocabularyConfig as JSDataverseExternalVocabularyConfig } from '@iqss/dataverse-client-javascript'

export type ExternalVocabularyConfig = JSDataverseExternalVocabularyConfig

export interface ExternalVocabularyVocab {
  uriSpace: string
  vocabularyUri?: string
}
