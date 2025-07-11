import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { FormProvider, useForm } from 'react-hook-form'
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
  metadataBlocks
}: AdvancedSearchFormProps) => {
  const { t } = useTranslation('shared')
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

    navigate(`${Route.COLLECTIONS_BASE}/${collectionId}?${searchParams.toString()}`)

    AdvancedSearchHelper.saveAdvancedSearchQueryToLocalStorage(collectionId, data)
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
    <FormProvider {...formMethods}>
      <form onSubmit={formMethods.handleSubmit(handleSubmit)} noValidate={true}>
        <Button variant="primary" type="submit" className="mb-3 px-3">
          {t('find')}
        </Button>

        <Accordion
          defaultActiveKey={['collections', 'files', ...metadataBlockNames]}
          alwaysOpen={true}>
          <Accordion.Item eventKey="collections">
            <Accordion.Header>{t('collections')}</Accordion.Header>
            <Accordion.Body>
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
                <Accordion.Body>
                  <MetadataBlockSearchFields metadataFields={metadataBlock.metadataFields} />
                </Accordion.Body>
              </Accordion.Item>
            )
          })}

          {/* Files  */}
          <Accordion.Item eventKey="files">
            <Accordion.Header>{t('files')}</Accordion.Header>
            <Accordion.Body>
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
