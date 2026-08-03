import { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Col, Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { ExternalVocabularyFormFieldPluginProps } from '../ExternalVocabularyPlugin'
import { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'
import { searchExternalVocabularyTerms } from '@/external-vocabularies/domain/useCases/searchExternalVocabularyTerms'
import { useExternalVocabularyRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import { MetadataFieldsHelper } from '@/sections/shared/form/DatasetMetadataForm/MetadataFieldsHelper'
import { searchOrcidPeople } from './searchOrcidPeople'
import { searchRorOrganizations } from './searchRorOrganizations'
import styles from './JsfPersonOrOrganizationFormField.module.scss'

type PersonOrOrganizationMode = 'person' | 'organization'

export function JsfPersonOrOrganizationFormField({
  name,
  title,
  description,
  watermark,
  requiredIndicator,
  externalVocabulary,
  builtFieldName,
  metadataBlockName,
  compoundParentName,
  fieldsArrayIndex,
  withinMultipleFieldsGroup,
  value,
  onChange,
  invalid,
  errorMessage
}: ExternalVocabularyFormFieldPluginProps) {
  const { i18n } = useTranslation()
  const { setValue } = useFormContext()
  const { externalVocabularyRepository } = useExternalVocabularyRepositories()
  const [mode, setMode] = useState<PersonOrOrganizationMode>(() => getModeFromValue(value))
  const [searchText, setSearchText] = useState('')
  const [results, setResults] = useState<ExternalVocabularyTerm[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [shouldSearch, setShouldSearch] = useState(false)
  const searchTextRef = useRef('')

  const selectedVocabulary = mode === 'person' ? 'orcid' : 'ror'
  const placeholder = watermark || 'Select or enter...'
  const apiFieldName = useMemo(
    () => MetadataFieldsHelper.replaceSlashWithDot(externalVocabulary.termUriField),
    [externalVocabulary.termUriField]
  )

  const updateSearchText = useCallback((nextSearchText: string) => {
    searchTextRef.current = nextSearchText
    setSearchText(nextSearchText)
  }, [])

  useEffect(() => {
    if (value === '') {
      setShouldSearch(false)
      updateSearchText('')
      return
    }

    if (value !== searchTextRef.current) {
      setShouldSearch(false)
      updateSearchText(value)
      setMode(getModeFromValue(value))
    }
  }, [updateSearchText, value])

  useEffect(() => {
    if (!shouldSearch || searchText.trim().length < 3) {
      setResults([])
      return
    }

    let cancelled = false
    const timeout = window.setTimeout(() => {
      setIsSearching(true)
      searchTerms({
        query: searchText,
        vocabulary: selectedVocabulary,
        language: i18n.language,
        fieldName: apiFieldName,
        externalVocabularyRepository
      })
        .then((terms) => {
          if (!cancelled) {
            setResults(terms)
          }
        })
        .finally(() => {
          if (!cancelled) {
            setIsSearching(false)
          }
        })
    }, 350)

    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [
    apiFieldName,
    externalVocabularyRepository,
    i18n.language,
    searchText,
    selectedVocabulary,
    shouldSearch
  ])

  const clearManagedFields = () => {
    Object.values(externalVocabulary.managedFields).forEach((managedFieldName) => {
      setValue(
        MetadataFieldsHelper.defineFieldName(
          managedFieldName,
          metadataBlockName,
          compoundParentName,
          fieldsArrayIndex
        ),
        '',
        { shouldDirty: true, shouldValidate: true }
      )
    })
  }

  const setManagedFieldsFromTerm = (term: ExternalVocabularyTerm) => {
    Object.entries(externalVocabulary.managedFields).forEach(([managedKey, managedFieldName]) => {
      const managedValue = getManagedFieldValue(term, managedKey)

      if (managedValue === undefined) {
        return
      }

      setValue(
        MetadataFieldsHelper.defineFieldName(
          managedFieldName,
          metadataBlockName,
          compoundParentName,
          fieldsArrayIndex
        ),
        managedValue,
        { shouldDirty: true, shouldValidate: true }
      )
    })
  }

  const handleModeChange = (nextMode: PersonOrOrganizationMode) => {
    setMode(nextMode)
    setShouldSearch(false)
    onChange('')
    updateSearchText('')
    setResults([])
    clearManagedFields()
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value
    setShouldSearch(true)
    updateSearchText(nextValue)
    setResults([])

    if (externalVocabulary.allowFreeText) {
      onChange(nextValue)
      clearManagedFields()
    }
  }

  const handleSelect = (term: ExternalVocabularyTerm) => {
    setShouldSearch(false)
    onChange(term.uri)
    updateSearchText(term.label)
    setResults([])
    setManagedFieldsFromTerm(term)
  }

  const handleClear = () => {
    setShouldSearch(false)
    onChange('')
    updateSearchText('')
    setResults([])
    clearManagedFields()
  }

  const handleOpen = () => {
    if (searchText.trim().length >= 3) {
      setShouldSearch(true)
    }
  }

  const radioGroupName = `${builtFieldName}-person-or-organization`

  return (
    <Form.Group controlId={builtFieldName} as={withinMultipleFieldsGroup ? Col : undefined}>
      <Form.Group.Label
        message={description}
        required={requiredIndicator}
        column={!withinMultipleFieldsGroup}
        sm={3}>
        {title}
      </Form.Group.Label>

      <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
        <div className={styles['mode-row']}>
          <Form.Group.Radio
            label="Person"
            checked={mode === 'person'}
            onChange={() => handleModeChange('person')}
            value="person"
            name={radioGroupName}
            id={`${builtFieldName}-person`}
          />
          <Form.Group.Radio
            label="Organization"
            checked={mode === 'organization'}
            onChange={() => handleModeChange('organization')}
            value="organization"
            name={radioGroupName}
            id={`${builtFieldName}-organization`}
          />
        </div>

        <div className={styles.combobox}>
          <Form.Group.Input
            className={styles['combobox-input']}
            type="text"
            value={searchText}
            onChange={handleChange}
            isInvalid={invalid}
            placeholder={placeholder}
            aria-required={requiredIndicator ? 'true' : 'false'}
            aria-label={`${title} ${mode === 'person' ? 'person' : 'organization'} search`}
            data-cvoc-field={name}
          />
          {searchText && (
            <button
              type="button"
              className={styles['clear-button']}
              onClick={handleClear}
              aria-label={`Clear ${title}`}>
              x
            </button>
          )}
          <button
            type="button"
            className={styles['toggle-button']}
            onClick={handleOpen}
            aria-label={`Show ${mode === 'person' ? 'ORCID' : 'ROR'} results`}>
            <span className={styles['toggle-caret']} />
          </button>
        </div>
        <Form.Group.Feedback type="invalid">{errorMessage}</Form.Group.Feedback>

        {results.length > 0 && (
          <div className={`list-group ${styles.results}`}>
            {results.map((term) => (
              <button
                className="list-group-item list-group-item-action"
                type="button"
                key={term.uri}
                onClick={() => handleSelect(term)}>
                <span className={styles['result-label']}>{term.label}</span>
                <small className="badge bg-secondary">{term.vocabularyName}</small>
                <small className={`text-muted ${styles['result-caption']}`}>{term.uri}</small>
              </button>
            ))}
          </div>
        )}

        {isSearching && (
          <Form.Group.Text>Searching {getVocabularyLabel(selectedVocabulary)}...</Form.Group.Text>
        )}
      </Col>
    </Form.Group>
  )
}

function getModeFromValue(value: string): PersonOrOrganizationMode {
  return value.startsWith('https://ror.org/') ? 'organization' : 'person'
}

async function searchTerms({
  query,
  vocabulary,
  language,
  fieldName,
  externalVocabularyRepository
}: {
  query: string
  vocabulary: string
  language: string
  fieldName: string
  externalVocabularyRepository: Parameters<typeof searchExternalVocabularyTerms>[0]
}): Promise<ExternalVocabularyTerm[]> {
  try {
    return await searchExternalVocabularyTerms(
      externalVocabularyRepository,
      fieldName,
      query,
      vocabulary,
      language
    )
  } catch {
    return vocabulary === 'ror' ? searchRorOrganizations(query) : searchOrcidPeople(query)
  }
}

function getManagedFieldValue(
  term: ExternalVocabularyTerm,
  managedKey: string
): string | undefined {
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

function getVocabularyLabel(vocabulary: string): string {
  return vocabulary === 'ror' ? 'ROR' : 'ORCID'
}
