import { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'
import { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'
import { ExternalVocabularyRepository } from '@/external-vocabularies/domain/repositories/ExternalVocabularyRepository'

const keywordVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'keyword',
  termUriField: 'keywordTermURI',
  protocol: 'skosmos',
  allowFreeText: false,
  languages: 'en',
  vocabs: {
    agrovoc: {
      uriSpace: 'https://agrovoc.fao.org/browse/agrovoc/en/page/',
      vocabularyUri: 'http://aims.fao.org/aos/agrovoc'
    },
    gemet: {
      uriSpace: 'https://www.eionet.europa.eu/gemet/en/concept/',
      vocabularyUri: 'https://www.eionet.europa.eu/gemet'
    }
  },
  managedFields: {
    termName: 'keywordValue',
    vocabularyName: 'keywordVocabulary',
    vocabularyUri: 'keywordVocabularyURI'
  }
}

const authorAffiliationRuntimeVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'authorAffiliation',
  termUriField: 'authorAffiliation',
  protocol: 'ror',
  allowFreeText: true,
  languages: '',
  vocabs: {
    ror: {
      uriSpace: 'https://ror.org/',
      vocabularyUri: 'https://ror.org/'
    }
  },
  managedFields: {}
}

const authorIdentifierOrcidVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'author',
  termUriField: 'authorIdentifier',
  protocol: 'orcid-or-ror',
  allowFreeText: false,
  languages: 'en',
  vocabs: {
    ror: {
      uriSpace: 'https://ror.org/',
      vocabularyUri: 'https://ror.org/'
    },
    orcid: {
      uriSpace: 'https://orcid.org/',
      vocabularyUri: 'https://orcid.org/'
    }
  },
  managedFields: {
    personName: 'authorName',
    idType: 'authorIdentifierScheme'
  }
}

const primitiveSingleDemoVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'demoPrimitiveSingleTermURI',
  termUriField: 'demoPrimitiveSingleTermURI',
  protocol: 'skosmos',
  allowFreeText: false,
  languages: 'en',
  vocabs: {
    agrovoc: {
      uriSpace: 'https://agrovoc.fao.org/browse/agrovoc/en/page/',
      vocabularyUri: 'http://aims.fao.org/aos/agrovoc'
    },
    gemet: {
      uriSpace: 'https://www.eionet.europa.eu/gemet/en/concept/',
      vocabularyUri: 'https://www.eionet.europa.eu/gemet'
    }
  },
  managedFields: {}
}

const primitiveMultipleDemoVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'demoPrimitiveMultipleTermURI',
  termUriField: 'demoPrimitiveMultipleTermURI',
  protocol: 'skosmos',
  allowFreeText: false,
  languages: 'en',
  vocabs: {
    agrovoc: {
      uriSpace: 'https://agrovoc.fao.org/browse/agrovoc/en/page/',
      vocabularyUri: 'http://aims.fao.org/aos/agrovoc'
    }
  },
  managedFields: {}
}

const compoundSingleDemoVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'demoCompoundSingle',
  termUriField: 'demoCompoundSingleTermURI',
  protocol: 'ror',
  allowFreeText: false,
  languages: '',
  vocabs: {
    ror: {
      uriSpace: 'https://ror.org/',
      vocabularyUri: 'https://ror.org/'
    }
  },
  managedFields: {
    termName: 'demoCompoundSingleName',
    vocabularyName: 'demoCompoundSingleVocabulary'
  }
}

const compoundMultipleDemoVocabularyConfig: ExternalVocabularyConfig = {
  fieldName: 'demoCompoundMultiple',
  termUriField: 'demoCompoundMultipleTermURI',
  protocol: 'ror',
  allowFreeText: false,
  languages: '',
  vocabs: {
    ror: {
      uriSpace: 'https://ror.org/',
      vocabularyUri: 'https://ror.org/'
    }
  },
  managedFields: {
    termName: 'demoCompoundMultipleName',
    vocabularyName: 'demoCompoundMultipleVocabulary'
  }
}

const keywordTerms: ExternalVocabularyTerm[] = [
  {
    uri: 'https://agrovoc.fao.org/browse/agrovoc/en/page/c_1665',
    label: 'Climate change',
    vocabularyName: 'AGROVOC',
    vocabularyUri: 'http://aims.fao.org/aos/agrovoc',
    source: 'agrovoc'
  },
  {
    uri: 'https://agrovoc.fao.org/browse/agrovoc/en/page/c_330892',
    label: 'Climate data',
    vocabularyName: 'AGROVOC',
    vocabularyUri: 'http://aims.fao.org/aos/agrovoc',
    source: 'agrovoc'
  },
  {
    uri: 'https://www.eionet.europa.eu/gemet/en/concept/1462',
    label: 'Climate protection',
    vocabularyName: 'GEMET',
    vocabularyUri: 'https://www.eionet.europa.eu/gemet',
    source: 'gemet'
  }
]

const topicTerms: ExternalVocabularyTerm[] = [
  {
    uri: 'https://agrovoc.fao.org/browse/agrovoc/en/page/c_1665',
    label: 'Climate change',
    vocabularyName: 'AGROVOC',
    vocabularyUri: 'http://aims.fao.org/aos/agrovoc',
    source: 'agrovoc'
  },
  {
    uri: 'https://agrovoc.fao.org/browse/agrovoc/en/page/c_330892',
    label: 'Climate data',
    vocabularyName: 'AGROVOC',
    vocabularyUri: 'http://aims.fao.org/aos/agrovoc',
    source: 'agrovoc'
  },
  {
    uri: 'https://www.eionet.europa.eu/gemet/en/concept/1462',
    label: 'Climate protection',
    vocabularyName: 'GEMET',
    vocabularyUri: 'https://www.eionet.europa.eu/gemet',
    source: 'gemet'
  }
]

const organizationTerms: ExternalVocabularyTerm[] = [
  {
    uri: 'https://ror.org/03vek6s52',
    label: 'Harvard University',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  },
  {
    uri: 'https://ror.org/05bnh6r87',
    label: 'University of Oxford',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  },
  {
    uri: 'https://ror.org/02y3ad647',
    label: 'University of Cambridge',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  }
]

const authorAffiliationTerms: ExternalVocabularyTerm[] = [
  {
    uri: 'https://ror.org/03vek6s52',
    label: 'Harvard University',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  },
  {
    uri: 'https://ror.org/044hpwe09',
    label: 'IIT@Harvard',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  },
  {
    uri: 'https://ror.org/00dvg7y05',
    label: 'Harvard Medical School',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  }
]

const authorIdentifierTerms: ExternalVocabularyTerm[] = [
  {
    uri: 'https://orcid.org/0000-0002-1825-1097',
    label: 'Jane Doe',
    vocabularyName: 'ORCID',
    vocabularyUri: 'https://orcid.org/',
    source: 'orcid'
  },
  {
    uri: 'https://orcid.org/0000-0003-1415-9265',
    label: 'John Smith',
    vocabularyName: 'ORCID',
    vocabularyUri: 'https://orcid.org/',
    source: 'orcid'
  },
  {
    uri: 'https://ror.org/03vek6s52',
    label: 'Harvard University',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  },
  {
    uri: 'https://ror.org/05bnh6r87',
    label: 'University of Oxford',
    vocabularyName: 'ROR',
    vocabularyUri: 'https://ror.org/',
    source: 'ror'
  }
]

const termsByFieldName: Record<string, ExternalVocabularyTerm[]> = {
  keywordTermURI: keywordTerms,
  authorAffiliation: authorAffiliationTerms,
  authorIdentifier: authorIdentifierTerms,
  demoPrimitiveSingleTermURI: topicTerms,
  demoPrimitiveMultipleTermURI: topicTerms,
  demoCompoundSingleTermURI: organizationTerms,
  demoCompoundMultipleTermURI: organizationTerms
}

export class ExternalVocabularyMockRepository implements ExternalVocabularyRepository {
  getConfiguredExternalVocabularies(): Promise<ExternalVocabularyConfig[]> {
    return Promise.resolve([
      keywordVocabularyConfig,
      authorAffiliationRuntimeVocabularyConfig,
      authorIdentifierOrcidVocabularyConfig,
      primitiveSingleDemoVocabularyConfig,
      primitiveMultipleDemoVocabularyConfig,
      compoundSingleDemoVocabularyConfig,
      compoundMultipleDemoVocabularyConfig
    ])
  }

  search(fieldName: string, query: string, vocabulary?: string): Promise<ExternalVocabularyTerm[]> {
    const normalizedFieldName = fieldName.replaceAll('/', '.')
    const normalizedQuery = query.trim().toLowerCase()
    const normalizedVocabulary = vocabulary?.trim().toLowerCase()

    const terms = termsByFieldName[normalizedFieldName] ?? []

    return Promise.resolve(
      terms.filter((term) => {
        const matchesQuery = term.label.toLowerCase().includes(normalizedQuery)
        const matchesVocabulary =
          normalizedVocabulary === undefined || term.source?.toLowerCase() === normalizedVocabulary

        return matchesQuery && matchesVocabulary
      })
    )
  }

  resolve(fieldName: string, uri: string): Promise<ExternalVocabularyTerm | null> {
    const normalizedFieldName = fieldName.replaceAll('/', '.')
    const terms = termsByFieldName[normalizedFieldName] ?? []

    return Promise.resolve(terms.find((term) => term.uri === uri) ?? null)
  }

  validate(_fieldName: string, value: string): Promise<boolean> {
    return Promise.resolve(value.trim().length > 0)
  }
}
