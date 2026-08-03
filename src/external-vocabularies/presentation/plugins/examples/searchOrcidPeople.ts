import { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'

export async function searchOrcidPeople(query: string): Promise<ExternalVocabularyTerm[]> {
  try {
    const response = await fetch(
      `https://pub.orcid.org/v3.0/expanded-search/?q=${encodeURIComponent(query)}`,
      { headers: { Accept: 'application/json' } }
    )

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as OrcidExpandedSearchResponse
    return (data['expanded-result'] ?? []).map(toExternalVocabularyTerm)
  } catch {
    return []
  }
}

interface OrcidExpandedSearchResponse {
  'expanded-result'?: OrcidExpandedSearchResult[]
}

interface OrcidExpandedSearchResult {
  'orcid-id': string
  'given-names'?: string | null
  'family-names'?: string | null
  'credit-name'?: string | null
  email?: string[]
  'institution-name'?: string[]
}

function toExternalVocabularyTerm(result: OrcidExpandedSearchResult): ExternalVocabularyTerm {
  const personName =
    result['credit-name'] ??
    [result['given-names'], result['family-names']].filter(Boolean).join(' ')
  const label = personName || result['orcid-id']
  const uri = `https://orcid.org/${result['orcid-id']}`

  return {
    uri,
    label,
    vocabularyName: 'ORCID',
    vocabularyUri: 'https://orcid.org/',
    source: 'orcid',
    mappedFields: {
      personName: label,
      termName: label,
      idType: 'ORCID',
      email: result.email?.[0],
      affiliation: result['institution-name']?.[0]
    }
  }
}
