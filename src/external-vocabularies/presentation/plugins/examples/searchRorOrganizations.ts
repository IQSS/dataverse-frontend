import { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'

export async function searchRorOrganizations(query: string): Promise<ExternalVocabularyTerm[]> {
  try {
    const response = await fetch(
      `https://api.ror.org/v2/organizations?query=${encodeURIComponent(query)}`
    )

    if (!response.ok) {
      return []
    }

    const data = (await response.json()) as RorOrganizationSearchResponse
    return (data.items ?? []).map(toExternalVocabularyTerm)
  } catch {
    return []
  }
}

interface RorOrganizationSearchResponse {
  items?: RorOrganization[]
}

interface RorOrganization {
  id: string
  names?: RorOrganizationName[]
  acronyms?: string[]
}

interface RorOrganizationName {
  value: string
  types?: string[]
}

function toExternalVocabularyTerm(organization: RorOrganization): ExternalVocabularyTerm {
  const label =
    organization.names?.find((name) => name.types?.includes('ror_display'))?.value ??
    organization.names?.[0]?.value ??
    organization.id

  return {
    uri: organization.id,
    label,
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror',
    mappedFields: {
      abbreviation: organization.acronyms?.[0],
      organizationName: label,
      personName: label,
      termName: label,
      idType: 'ROR',
      vocabularyName: 'ROR',
      vocabularyUri: 'https://ror.org/'
    }
  }
}
