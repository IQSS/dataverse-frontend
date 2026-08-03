import { ExternalVocabularyTerm } from '../models/ExternalVocabularyTerm'
import { ExternalVocabularyRepository } from '../repositories/ExternalVocabularyRepository'

export function searchExternalVocabularyTerms(
  externalVocabularyRepository: ExternalVocabularyRepository,
  fieldName: string,
  query: string,
  vocabulary?: string,
  language?: string
): Promise<ExternalVocabularyTerm[]> {
  return externalVocabularyRepository.search(fieldName, query, vocabulary, language)
}
