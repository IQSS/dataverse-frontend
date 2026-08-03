import {
  getConfiguredExternalVocabularies,
  resolveExternalVocabularyTerm,
  searchExternalVocabularyTerms,
  validateExternalVocabularyValue
} from '@iqss/dataverse-client-javascript'
import type { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'
import type { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'
import type { ExternalVocabularyRepository } from '@/external-vocabularies/domain/repositories/ExternalVocabularyRepository'

export class ExternalVocabularyJSDataverseRepository implements ExternalVocabularyRepository {
  async getConfiguredExternalVocabularies(): Promise<ExternalVocabularyConfig[]> {
    return getConfiguredExternalVocabularies.execute()
  }

  async search(
    fieldName: string,
    query: string,
    vocabulary?: string,
    language?: string
  ): Promise<ExternalVocabularyTerm[]> {
    return searchExternalVocabularyTerms.execute(fieldName, query, vocabulary, language)
  }

  async resolve(
    fieldName: string,
    uri: string,
    language?: string
  ): Promise<ExternalVocabularyTerm | null> {
    try {
      return await resolveExternalVocabularyTerm.execute(fieldName, uri, language)
    } catch {
      return null
    }
  }

  async validate(fieldName: string, value: string): Promise<boolean> {
    return validateExternalVocabularyValue.execute(fieldName, value)
  }
}
