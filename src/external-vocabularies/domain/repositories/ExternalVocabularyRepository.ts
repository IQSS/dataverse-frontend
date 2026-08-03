import { ExternalVocabularyConfig } from '../models/ExternalVocabularyConfig'
import { ExternalVocabularyTerm } from '../models/ExternalVocabularyTerm'

export interface ExternalVocabularyRepository {
  getConfiguredExternalVocabularies(): Promise<ExternalVocabularyConfig[]>
  search(
    fieldName: string,
    query: string,
    vocabulary?: string,
    language?: string
  ): Promise<ExternalVocabularyTerm[]>
  resolve(fieldName: string, uri: string, language?: string): Promise<ExternalVocabularyTerm | null>
  validate(fieldName: string, value: string): Promise<boolean>
}
