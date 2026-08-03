import { ExternalVocabularyPlugin } from '../ExternalVocabularyPlugin'
import { RorOrganizationDisplayValue } from './RorOrganizationDisplayValue'
import { protocolIncludes } from './pluginMatching'
import { searchRorOrganizations } from './searchRorOrganizations'

export const rorOrganizationPlugin: ExternalVocabularyPlugin = {
  id: 'dataverse.example.ror-organization',
  matches: (externalVocabulary) => protocolIncludes(externalVocabulary, 'ror'),
  DisplayValue: RorOrganizationDisplayValue,
  formatTerm: (term) => ({
    label: term.label,
    caption: term.uri,
    badge: term.vocabularyName ?? 'ROR'
  }),
  searchTerms: (query, vocabulary) => {
    if (vocabulary.toLowerCase() !== 'ror') {
      return Promise.resolve(undefined)
    }

    return searchRorOrganizations(query)
  },
  getManagedFieldValue: (term, managedKey) => {
    switch (managedKey) {
      case 'organizationName':
      case 'termName':
      case 'personName':
        return term.label
      case 'idType':
      case 'vocabularyName':
        return term.vocabularyName ?? 'ROR'
      case 'vocabularyUri':
        return term.vocabularyUri
      default:
        return typeof term.mappedFields?.[managedKey] === 'string'
          ? term.mappedFields[managedKey]
          : undefined
    }
  }
}
