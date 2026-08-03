import { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'

export function protocolIs(
  externalVocabulary: ExternalVocabularyConfig,
  protocol: string
): boolean {
  return externalVocabulary.protocol?.toLowerCase() === protocol.toLowerCase()
}

export function protocolIncludes(
  externalVocabulary: ExternalVocabularyConfig,
  protocolPart: string
): boolean {
  return externalVocabulary.protocol?.toLowerCase().includes(protocolPart.toLowerCase()) ?? false
}

export function fieldIs(
  externalVocabulary: ExternalVocabularyConfig,
  ...fieldNames: string[]
): boolean {
  return fieldNames.includes(externalVocabulary.fieldName)
}

export function isHttpUri(value: unknown): value is string {
  return typeof value === 'string' && /^https?:\/\//.test(value)
}
