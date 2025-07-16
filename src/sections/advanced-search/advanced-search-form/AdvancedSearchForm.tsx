import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
import { ArrowClockwise } from 'react-bootstrap-icons'
import { Accordion, Button } from '@iqss/dataverse-design-system'
import {
  MetadataBlockInfo,
  MetadataBlockName
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { SearchFields } from '@/search/domain/models/SearchFields'
import { CollectionItemsQueryParams } from '@/collection/domain/models/CollectionItemsQueryParams'
import { Route } from '@/sections/Route.enum'
import { CollectionItemType } from '@/collection/domain/models/CollectionItemType'
import { CollectionsSearchFields } from './CollectionsSearchFields'
import { MetadataBlockSearchFields } from './MetadataBlockSearchFields'
import { FilesSearchFields } from './FilesSearchFields'
import { AdvancedSearchHelper } from '../AdvancedSearchHelper'

interface AdvancedSearchFormProps {
  collectionId: string
  formDefaultValues: AdvancedSearchFormData
  metadataBlocks: MetadataBlockInfo[]
  collectionFilterQueries?: string
}

export interface AdvancedSearchFormData {
  collections: CollectionsFields
  datasets: DatasetsFields
  files: FilesFields
}

export interface CollectionsFields {
  [SearchFields.DATAVERSE_NAME]: string
  [SearchFields.DATAVERSE_ALIAS]: string
  [SearchFields.DATAVERSE_AFFILIATION]: string
  [SearchFields.DATAVERSE_DESCRIPTION]: string
  [SearchFields.DATAVERSE_SUBJECT]: string[]
}

export type DatasetsFields = Record<string, string | string[]>

export type FilesFields = {
  [SearchFields.FILE_NAME]: string
  [SearchFields.FILE_DESCRIPTION]: string
  [SearchFields.FILE_TYPE_SEARCHABLE]: string
  [SearchFields.FILE_PERSISTENT_ID]: string
  [SearchFields.VARIABLE_NAME]: string
  [SearchFields.VARIABLE_LABEL]: string
  [SearchFields.FILE_TAG_SEARCHABLE]: string
}

export const AdvancedSearchForm = ({
  collectionId,
  formDefaultValues,
  metadataBlocks,
  collectionFilterQueries
}: AdvancedSearchFormProps) => {
  const { t } = useTranslation('shared')
  const { t: tAdvancedSearch } = useTranslation('advancedSearch')
  const [resetKey, setResetKey] = useState(0)
  const navigate = useNavigate()

  const formMethods = useForm<AdvancedSearchFormData>({
    mode: 'onChange',
    defaultValues: formDefaultValues
  })

  const handleSubmit = (data: AdvancedSearchFormData) => {
    const advancedSearchQuery = AdvancedSearchHelper.constructSearchQuery(data)
    const searchParams = new URLSearchParams()
    searchParams.set(CollectionItemsQueryParams.QUERY, advancedSearchQuery)
    searchParams.set(
      CollectionItemsQueryParams.TYPES,
      [CollectionItemType.COLLECTION, CollectionItemType.DATASET, CollectionItemType.FILE].join(',')
    )
    // We navigate to the collection page with the previous filter queries if they exist
    if (collectionFilterQueries) {
      searchParams.set(CollectionItemsQueryParams.FILTER_QUERIES, collectionFilterQueries)
    }

    navigate(`${Route.COLLECTIONS_BASE}/${collectionId}?${searchParams.toString()}`)

    AdvancedSearchHelper.saveAdvancedSearchQueryToLocalStorage(collectionId, data)
  }

  const handleClearForm = () => {
    formMethods.reset(AdvancedSearchHelper.getFormDefaultValues(metadataBlocks, null))
    AdvancedSearchHelper.clearPreviousAdvancedSearchQueryFromLocalStorage() // Clear local storage in case there was a previous search saved.
    setResetKey((prev) => prev + 1) // This is a workaround to force re-render components that depend on the form values.
  }

  const subjectFieldControlledVocab: string[] = useMemo(
    () =>
      metadataBlocks.find((block) => block.name === MetadataBlockName.CITATION)?.metadataFields[
        'subject'
      ].controlledVocabularyValues as string[],
    [metadataBlocks]
  )

  const metadataBlockNames: string[] = metadataBlocks.map((block) => block.name)

  const searchableMetadataBlockFields =
    AdvancedSearchHelper.filterSearchableMetadataBlockFields(metadataBlocks)

  return (
    <FormProvider {...formMethods} key={resetKey}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)} noValidate={true}>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Button variant="primary" type="submit" className="px-3">
            {t('find')}
          </Button>
          <Button variant="secondary" type="button" onClick={handleClearForm}>
            <div className="d-flex align-items-center gap-2">
              <ArrowClockwise />
              {tAdvancedSearch('clearForm')}
            </div>
          </Button>
        </div>

        <Accordion
          defaultActiveKey={['collections', 'files', ...metadataBlockNames]}
          alwaysOpen={true}>
          <Accordion.Item eventKey="collections">
            <Accordion.Header>{t('collections')}</Accordion.Header>
            <Accordion.Body data-testid="advanced-search-collections">
              <CollectionsSearchFields subjectControlledVocabulary={subjectFieldControlledVocab} />
            </Accordion.Body>
          </Accordion.Item>

          {/*  Datasets Metadata blocks  */}
          {searchableMetadataBlockFields.map((metadataBlock) => {
            if (Object.keys(metadataBlock.metadataFields).length === 0) {
              return null // Skip empty metadata blocks
            }

            return (
              <Accordion.Item eventKey={metadataBlock.name} key={metadataBlock.name}>
                <Accordion.Header>
                  {`${t('datasets')}: ${metadataBlock.displayName}`}
                </Accordion.Header>
                <Accordion.Body
                  data-testid={`advanced-search-metadata-block-${metadataBlock.name}`}>
                  <MetadataBlockSearchFields metadataFields={metadataBlock.metadataFields} />
                </Accordion.Body>
              </Accordion.Item>
            )
          })}

          {/* Files  */}
          <Accordion.Item eventKey="files">
            <Accordion.Header>{t('files')}</Accordion.Header>
            <Accordion.Body data-testid="advanced-search-files">
              <FilesSearchFields />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        <Button variant="primary" type="submit" className="mt-3 px-3">
          {t('find')}
        </Button>
      </form>
    </FormProvider>
  )
}
