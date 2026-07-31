import { ExternalVocabularyRepository } from '../repositories/ExternalVocabularyRepository'
import { ExternalVocabularyConfig } from '../models/ExternalVocabularyConfig'

export function getConfiguredExternalVocabularies(
  externalVocabularyRepository: ExternalVocabularyRepository
): Promise<ExternalVocabularyConfig[]> {
  return externalVocabularyRepository.getConfiguredExternalVocabularies()
}
