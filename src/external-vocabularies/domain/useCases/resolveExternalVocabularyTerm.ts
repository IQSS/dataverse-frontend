import { ExternalVocabularyTerm } from '../models/ExternalVocabularyTerm'
import { ExternalVocabularyRepository } from '../repositories/ExternalVocabularyRepository'

export function resolveExternalVocabularyTerm(
  externalVocabularyRepository: ExternalVocabularyRepository,
  fieldName: string,
  uri: string,
  language?: string
): Promise<ExternalVocabularyTerm | null> {
  return externalVocabularyRepository.resolve(fieldName, uri, language)
}
