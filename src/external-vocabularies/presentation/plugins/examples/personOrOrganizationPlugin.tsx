import { ExternalVocabularyPlugin } from '../ExternalVocabularyPlugin'
import { JsfPersonOrOrganizationFormField } from './JsfPersonOrOrganizationFormField'
import { protocolIs } from './pluginMatching'
import { searchOrcidPeople } from './searchOrcidPeople'
import { searchRorOrganizations } from './searchRorOrganizations'

export const personOrOrganizationPlugin: ExternalVocabularyPlugin = {
  id: 'dataverse.example.person-or-organization-jsf',
  matches: (externalVocabulary) => protocolIs(externalVocabulary, 'orcid-or-ror'),
  FormField: JsfPersonOrOrganizationFormField,
  formatTerm: (term) => ({
    label: term.label,
    caption: term.uri,
    badge: term.vocabularyName
  }),
  searchTerms: (query, vocabulary) => {
    switch (vocabulary.toLowerCase()) {
      case 'orcid':
        return searchOrcidPeople(query)
      case 'ror':
        return searchRorOrganizations(query)
      default:
        return Promise.resolve(undefined)
    }
  },
  getManagedFieldValue: (term, managedKey) => {
    const mappedValue = term.mappedFields?.[managedKey]

    if (typeof mappedValue === 'string') {
      return mappedValue
    }

    switch (managedKey) {
      case 'personName':
      case 'termName':
        return term.label
      case 'idType':
      case 'vocabularyName':
        return term.vocabularyName
      case 'vocabularyUri':
        return term.vocabularyUri
      default:
        return undefined
    }
  }
}
