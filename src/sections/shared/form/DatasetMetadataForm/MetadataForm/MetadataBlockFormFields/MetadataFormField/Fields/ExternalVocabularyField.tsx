import {
  ChangeEvent,
  ForwardedRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { Button, Col, Form } from '@iqss/dataverse-design-system'
import { useTranslation } from 'react-i18next'
import { MetadataFieldsHelper } from '../../../../MetadataFieldsHelper'
import { type CommonFieldProps } from '..'
import { CustomInstructionsEditor } from '../CustomInstructionsEditor'
import { ExternalVocabularyTerm } from '@/external-vocabularies/domain/models/ExternalVocabularyTerm'
import { ExternalVocabularyConfig } from '@/external-vocabularies/domain/models/ExternalVocabularyConfig'
import { searchExternalVocabularyTerms } from '@/external-vocabularies/domain/useCases/searchExternalVocabularyTerms'
import { resolveExternalVocabularyTerm } from '@/external-vocabularies/domain/useCases/resolveExternalVocabularyTerm'
import { ExternalVocabularyPlugin } from '@/external-vocabularies/presentation/plugins/ExternalVocabularyPlugin'
import { getExternalVocabularyPlugin } from '@/external-vocabularies/presentation/plugins/externalVocabularyPluginRegistry'
import { useExternalVocabularyRepositories } from '@/shared/contexts/repositories/RepositoriesProvider'
import styles from '../index.module.scss'

interface ExternalVocabularyFieldProps extends CommonFieldProps {
  externalVocabulary: ExternalVocabularyConfig
  metadataBlockName: string
  compoundParentName?: string
  withinMultipleFieldsGroup: boolean
  fieldsArrayIndex?: number
}

export const ExternalVocabularyField = ({
  name,
  title,
  description,
  watermark,
  rulesToApply,
  metadataBlockName,
  compoundParentName,
  withinMultipleFieldsGroup,
  fieldsArrayIndex,
  fieldInstructions,
  instructionEditor,
  requiredIndicator,
  externalVocabulary
}: ExternalVocabularyFieldProps) => {
  const { control } = useFormContext()

  const builtFieldName = useMemo(
    () =>
      MetadataFieldsHelper.defineFieldName(
        name,
        metadataBlockName,
        compoundParentName,
        fieldsArrayIndex
      ),
    [name, metadataBlockName, compoundParentName, fieldsArrayIndex]
  )

  return (
    <Controller
      name={builtFieldName}
      control={control}
      rules={rulesToApply}
      render={({ field: { onChange, ref, value }, fieldState: { invalid, error } }) => (
        <ExternalVocabularyFieldControl
          name={name}
          title={title}
          description={description}
          watermark={watermark}
          metadataBlockName={metadataBlockName}
          compoundParentName={compoundParentName}
          withinMultipleFieldsGroup={withinMultipleFieldsGroup}
          fieldsArrayIndex={fieldsArrayIndex}
          fieldInstructions={fieldInstructions}
          instructionEditor={instructionEditor}
          requiredIndicator={requiredIndicator}
          externalVocabulary={externalVocabulary}
          builtFieldName={builtFieldName}
          value={typeof value === 'string' ? value : ''}
          onChange={onChange}
          inputRef={ref}
          invalid={invalid}
          errorMessage={error?.message}
        />
      )}
    />
  )
}

interface ExternalVocabularyFieldControlProps
  extends Omit<ExternalVocabularyFieldProps, 'type' | 'rulesToApply' | 'displayName'> {
  builtFieldName: string
  value: string
  onChange: (value: string) => void
  inputRef: ForwardedRef<HTMLInputElement | null>
  invalid: boolean
  errorMessage?: string
}

const ExternalVocabularyFieldControl = ({
  name,
  title,
  description,
  watermark,
  metadataBlockName,
  compoundParentName,
  withinMultipleFieldsGroup,
  fieldsArrayIndex,
  fieldInstructions,
  instructionEditor,
  requiredIndicator,
  externalVocabulary,
  builtFieldName,
  value,
  onChange,
  inputRef,
  invalid,
  errorMessage
}: ExternalVocabularyFieldControlProps) => {
  const plugin = useMemo(
    () => getExternalVocabularyPlugin(externalVocabulary),
    [externalVocabulary]
  )

  if (plugin?.FormField) {
    const PluginFormField = plugin.FormField

    return (
      <PluginFormField
        name={name}
        title={title}
        description={description}
        watermark={watermark}
        requiredIndicator={requiredIndicator}
        externalVocabulary={externalVocabulary}
        builtFieldName={builtFieldName}
        metadataBlockName={metadataBlockName}
        compoundParentName={compoundParentName}
        fieldsArrayIndex={fieldsArrayIndex}
        withinMultipleFieldsGroup={withinMultipleFieldsGroup}
        value={value}
        onChange={onChange}
        invalid={invalid}
        errorMessage={errorMessage}
      />
    )
  }

  return (
    <GenericExternalVocabularyFieldControl
      {...{
        name,
        title,
        description,
        watermark,
        metadataBlockName,
        compoundParentName,
        withinMultipleFieldsGroup,
        fieldsArrayIndex,
        fieldInstructions,
        instructionEditor,
        requiredIndicator,
        externalVocabulary,
        builtFieldName,
        value,
        onChange,
        inputRef,
        invalid,
        errorMessage,
        plugin
      }}
    />
  )
}

interface GenericExternalVocabularyFieldControlProps extends ExternalVocabularyFieldControlProps {
  plugin?: ExternalVocabularyPlugin
}

function GenericExternalVocabularyFieldControl({
  name,
  title,
  description,
  watermark,
  metadataBlockName,
  compoundParentName,
  withinMultipleFieldsGroup,
  fieldsArrayIndex,
  fieldInstructions,
  instructionEditor,
  requiredIndicator,
  externalVocabulary,
  builtFieldName,
  value,
  onChange,
  inputRef,
  invalid,
  errorMessage,
  plugin
}: GenericExternalVocabularyFieldControlProps) {
  const { i18n } = useTranslation()
  const { setValue } = useFormContext()
  const { externalVocabularyRepository } = useExternalVocabularyRepositories()
  const [searchText, setSearchText] = useState('')
  const [shouldSearch, setShouldSearch] = useState(false)
  const [results, setResults] = useState<ExternalVocabularyTerm[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const searchTextRef = useRef('')
  const [selectedVocabulary, setSelectedVocabulary] = useState(() => {
    return Object.keys(externalVocabulary.vocabs)[0] ?? ''
  })

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

    if (!value.startsWith('http')) {
      if (value !== searchTextRef.current) {
        setShouldSearch(false)
        updateSearchText(value)
      }
      return
    }

    let cancelled = false
    void resolveExternalVocabularyTerm(
      externalVocabularyRepository,
      apiFieldName,
      value,
      i18n.language
    )
      .then((term) => {
        if (cancelled) return
        setShouldSearch(false)
        updateSearchText(term?.label ?? value)
      })
      .catch(() => {
        if (cancelled) return
        setShouldSearch(false)
        updateSearchText(value)
      })

    return () => {
      cancelled = true
    }
  }, [apiFieldName, externalVocabularyRepository, i18n.language, updateSearchText, value])

  useEffect(() => {
    if (!shouldSearch || searchText.trim().length < 3) {
      setResults([])
      return
    }

    let cancelled = false
    const timeout = window.setTimeout(() => {
      setIsSearching(true)
      searchTerms(searchText, selectedVocabulary, i18n.language)
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
    externalVocabulary,
    i18n.language,
    plugin,
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
      const managedValue =
        plugin?.getManagedFieldValue?.(term, managedKey, externalVocabulary) ??
        getManagedValue(term, managedKey)
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

  const handleVocabularyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedVocabulary(event.target.value)
    onChange('')
    setResults([])
    clearManagedFields()
  }

  const searchTerms = async (
    query: string,
    vocabulary: string,
    language: string
  ): Promise<ExternalVocabularyTerm[]> => {
    const pluginTerms = await plugin?.searchTerms?.(query, vocabulary, language, externalVocabulary)

    if (pluginTerms !== undefined) {
      return pluginTerms
    }

    return searchExternalVocabularyTerms(
      externalVocabularyRepository,
      apiFieldName,
      query,
      vocabulary,
      language
    )
  }

  const vocabularyKeys = Object.keys(externalVocabulary.vocabs)
  const formatTerm = (term: ExternalVocabularyTerm) =>
    plugin?.formatTerm?.(term, externalVocabulary) ?? {
      label: term.label,
      caption: term.uri
    }

  return (
    <Form.Group controlId={builtFieldName} as={withinMultipleFieldsGroup ? Col : undefined}>
      <Form.Group.Label
        message={description}
        required={requiredIndicator}
        className={styles['field-label']}
        column={!withinMultipleFieldsGroup}
        sm={3}>
        {title}
      </Form.Group.Label>

      <Col sm={withinMultipleFieldsGroup ? 12 : 9}>
        {instructionEditor ? (
          <CustomInstructionsEditor
            value={instructionEditor.value}
            onSave={instructionEditor.onSave}
            fieldKey={instructionEditor.fieldKey}
          />
        ) : (
          fieldInstructions && <Form.Group.Text>{fieldInstructions}</Form.Group.Text>
        )}

        <div className={styles['external-vocabulary-control-row']}>
          {vocabularyKeys.length > 1 && (
            <div className={styles['external-vocabulary-select-container']}>
              <Form.Group.Select value={selectedVocabulary} onChange={handleVocabularyChange}>
                {vocabularyKeys.map((vocabularyKey) => (
                  <option key={vocabularyKey} value={vocabularyKey}>
                    {vocabularyKey}
                  </option>
                ))}
              </Form.Group.Select>
            </div>
          )}

          <div className={styles['external-vocabulary-search-container']}>
            <Form.Group.Input
              type="text"
              value={searchText}
              onChange={handleChange}
              isInvalid={invalid}
              placeholder={watermark || 'Search external vocabulary'}
              aria-required={requiredIndicator ? 'true' : 'false'}
              data-cvoc-field={name}
              ref={inputRef}
            />
            <Form.Group.Feedback type="invalid">{errorMessage}</Form.Group.Feedback>

            {results.length > 0 && (
              <div className="list-group mt-1">
                {results.map((term) => (
                  <ExternalVocabularySearchResultButton
                    key={term.uri}
                    term={term}
                    formatTerm={formatTerm}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            )}

            {isSearching && <Form.Group.Text>Searching...</Form.Group.Text>}
          </div>

          <div className={styles['external-vocabulary-action-container']}>
            <Button type="button" variant="secondary" onClick={handleClear}>
              Clear
            </Button>
          </div>
        </div>
      </Col>
    </Form.Group>
  )
}

interface ExternalVocabularySearchResultButtonProps {
  term: ExternalVocabularyTerm
  formatTerm: (term: ExternalVocabularyTerm) => {
    label: ReactNode
    caption?: ReactNode
    badge?: ReactNode
  }
  onSelect: (term: ExternalVocabularyTerm) => void
}

function ExternalVocabularySearchResultButton({
  term,
  formatTerm,
  onSelect
}: ExternalVocabularySearchResultButtonProps) {
  const termDisplay = formatTerm(term)

  return (
    <button
      className="list-group-item list-group-item-action"
      type="button"
      onClick={() => onSelect(term)}>
      <span>{termDisplay.label}</span>
      {termDisplay.badge && <small className="ms-2 badge bg-secondary">{termDisplay.badge}</small>}
      {termDisplay.caption && <small className="d-block text-muted">{termDisplay.caption}</small>}
    </button>
  )
}

function getManagedValue(term: ExternalVocabularyTerm, managedKey: string): string | undefined {
  const mappedValue = term.mappedFields?.[managedKey]
  if (typeof mappedValue === 'string') {
    return mappedValue
  }

  switch (managedKey) {
    case 'termName':
    case 'personName':
      return term.label
    case 'vocabularyName':
    case 'idType':
      return term.vocabularyName
    case 'vocabularyUri':
      return term.vocabularyUri
    default:
      return undefined
  }
}
