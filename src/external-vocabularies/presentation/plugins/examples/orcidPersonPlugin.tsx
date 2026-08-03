import { ExternalVocabularyPlugin } from '../ExternalVocabularyPlugin'
import { protocolIncludes } from './pluginMatching'
import { searchOrcidPeople } from './searchOrcidPeople'
import { searchRorOrganizations } from './searchRorOrganizations'

export const orcidPersonPlugin: ExternalVocabularyPlugin = {
  id: 'dataverse.example.orcid-person',
  matches: (externalVocabulary) => protocolIncludes(externalVocabulary, 'orcid'),
  formatTerm: (term) => ({
    label: term.label,
    caption: term.uri,
    badge: term.vocabularyName ?? 'ORCID'
  }),
  searchTerms: async (query, vocabulary) => {
    const normalizedVocabulary = vocabulary.toLowerCase()

    if (normalizedVocabulary === 'ror') {
      return searchRorOrganizations(query)
    }

    if (normalizedVocabulary !== 'orcid') {
      return undefined
    }

    return searchOrcidPeople(query)
  },
  getManagedFieldValue: (term, managedKey) => {
    switch (managedKey) {
      case 'personName':
      case 'termName':
        return term.label
      case 'idType':
        return term.vocabularyName ?? 'ORCID'
      default:
        return typeof term.mappedFields?.[managedKey] === 'string'
          ? term.mappedFields[managedKey]
          : undefined
    }
  }
}
