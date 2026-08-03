import { ExternalVocabularyPlugin } from '../ExternalVocabularyPlugin'
import { protocolIs } from './pluginMatching'
import { searchSkosmosTerms } from './searchSkosmosTerms'

export const skosmosVocabularyPlugin: ExternalVocabularyPlugin = {
  id: 'dataverse.example.skosmos',
  matches: (externalVocabulary) => protocolIs(externalVocabulary, 'skosmos'),
  formatTerm: (term) => ({
    label: term.label,
    caption: term.uri,
    badge: term.vocabularyName
  }),
  searchTerms: (query, vocabulary, language, externalVocabulary) =>
    searchSkosmosTerms(query, vocabulary, language, externalVocabulary),
  getManagedFieldValue: (term, managedKey) => {
    switch (managedKey) {
      case 'termName':
        return term.label
      case 'vocabularyName':
        return term.vocabularyName
      case 'vocabularyUri':
        return term.vocabularyUri
      default:
        return typeof term.mappedFields?.[managedKey] === 'string'
          ? term.mappedFields[managedKey]
          : undefined
    }
  }
}
