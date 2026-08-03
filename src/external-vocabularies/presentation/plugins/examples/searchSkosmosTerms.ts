import { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'
import { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'

export async function searchSkosmosTerms(
  query: string,
  vocabulary: string,
  language: string,
  externalVocabulary: ExternalVocabularyConfig
): Promise<ExternalVocabularyTerm[]> {
  try {
    const serviceUrl = getServiceUrl(externalVocabulary)
    const searchUrl = new URL('rest/v1/search', serviceUrl)
    searchUrl.searchParams.set('unique', 'true')
    searchUrl.searchParams.set('vocab', vocabulary)
    searchUrl.searchParams.set('lang', getSkosmosLanguage(language))
    searchUrl.searchParams.set('query', `${query}*`)

    const termParentUri = getStringConfigValue(externalVocabulary, 'term-parent-uri')
    if (termParentUri) {
      searchUrl.searchParams.set('parent', termParentUri)
    }

    const response = await fetch(searchUrl.toString())

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as SkosmosSearchResponse
    return (data.results ?? []).map((result) =>
      toExternalVocabularyTerm(result, vocabulary, externalVocabulary)
    )
  } catch {
    return []
  }
}

interface SkosmosSearchResponse {
  results?: SkosmosSearchResult[]
}

interface SkosmosSearchResult {
  uri: string
  prefLabel?: string
  vocab?: string
  localname?: string
}

function toExternalVocabularyTerm(
  result: SkosmosSearchResult,
  selectedVocabulary: string,
  externalVocabulary: ExternalVocabularyConfig
): ExternalVocabularyTerm {
  const vocabularyName = result.vocab ?? selectedVocabulary
  const vocabularyUri = getVocabularyUri(externalVocabulary, vocabularyName)
  const label = result.prefLabel ?? result.localname ?? result.uri

  return {
    uri: result.uri,
    label,
    vocabularyName,
    vocabularyUri,
    source: 'skosmos',
    mappedFields: {
      termName: label,
      vocabularyName,
      vocabularyUri
    }
  }
}

function getServiceUrl(externalVocabulary: ExternalVocabularyConfig): string {
  const configuredUrl = getStringConfigValue(externalVocabulary, 'cvoc-url')
  const serviceUrl = configuredUrl || 'https://demo.skosmos.org/'

  return serviceUrl.endsWith('/') ? serviceUrl : `${serviceUrl}/`
}

function getSkosmosLanguage(language: string): string {
  return language.split('-')[0] || 'en'
}

function getVocabularyUri(
  externalVocabulary: ExternalVocabularyConfig,
  vocabularyName: string
): string | undefined {
  const vocabs = externalVocabulary.vocabs as Record<string, { vocabularyUri?: string }> | undefined

  return vocabs?.[vocabularyName]?.vocabularyUri
}

function getStringConfigValue(
  externalVocabulary: ExternalVocabularyConfig,
  key: string
): string | undefined {
  const value = (externalVocabulary as unknown as Record<string, unknown>)[key]

  return typeof value === 'string' && value.trim() ? value : undefined
}
