import { MouseEvent, useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Stack } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '../../../collection/domain/repositories/CollectionRepository'
import {
  CollectionType,
  CollectionStorage
} from '../../../collection/domain/useCases/DTOs/CollectionDTO'
import { SubmissionStatus, useSubmitCollection } from './useSubmitCollection'
import { ReducedMetadataBlockInfo } from '../useGetAllMetadataBlocksInfo'
import {
  MetadataBlockName,
  MetadataField
} from '../../../metadata-block-info/domain/models/MetadataBlockInfo'
import { SeparationLine } from '../../shared/layout/SeparationLine/SeparationLine'
import { TopFieldsSection } from './top-fields-section/TopFieldsSection'
import { MetadataFieldsSection } from './metadata-fields-section/MetadataFieldsSection'
import { BrowseSearchFacetsSection } from './browse-search-facets-section/BrowseSearchFacetsSection'
import styles from './CollectionForm.module.scss'

export const METADATA_BLOCKS_NAMES_GROUPER = 'metadataBlockNames'
export const USE_FIELDS_FROM_PARENT = 'useFieldsFromParent'
export const INPUT_LEVELS_GROUPER = 'inputLevels'
export const FACET_IDS_FIELD = 'facetIds'
export const USE_FACETS_FROM_PARENT = 'useFacetsFromParent'

export interface CollectionFormProps {
  collectionRepository: CollectionRepository
  ownerCollectionId: string
  defaultValues: CollectionFormData
  allMetadataBlocksInfo: ReducedMetadataBlockInfo[]
  allFacetableMetadataFields: MetadataField[]
  defaultCollectionFacets: CollectionFormFacet[]
}

export type CollectionFormData = {
  hostCollection: string
  name: string
  affiliation: string
  alias: string
  storage: CollectionStorage
  type: CollectionType | ''
  description: string
  contacts: { value: string }[]
  [USE_FIELDS_FROM_PARENT]: boolean
  [METADATA_BLOCKS_NAMES_GROUPER]: CollectionFormMetadataBlocks
  [INPUT_LEVELS_GROUPER]: FormattedCollectionInputLevels
  [USE_FACETS_FROM_PARENT]: boolean
  facetIds: CollectionFormFacet[]
}

export type CollectionFormMetadataBlocks = Record<MetadataBlockName, boolean>

export type FormattedCollectionInputLevels = {
  [key: string]: {
    include: boolean
    optionalOrRequired: CollectionFormInputLevelValue
    parentBlockName: MetadataBlockName
  }
}

export type FormattedCollectionInputLevelsWithoutParentBlockName = {
  [K in keyof FormattedCollectionInputLevels]: Omit<
    FormattedCollectionInputLevels[K],
    'parentBlockName'
  >
}

export const CollectionFormInputLevelOptions = {
  OPTIONAL: 'optional',
  REQUIRED: 'required'
} as const

export type CollectionFormInputLevelValue =
  (typeof CollectionFormInputLevelOptions)[keyof typeof CollectionFormInputLevelOptions]

export const CONDITIONALLY_REQUIRED_FIELDS = ['producerName']

export type CollectionFormFacet = {
  value: string
  label: string
  id: string
}

// On the submit function callback, type is CollectionType as type field is required and wont never be ""
export type CollectionFormValuesOnSubmit = Omit<CollectionFormData, 'type'> & {
  type: CollectionType
}

export const CollectionForm = ({
  collectionRepository,
  ownerCollectionId,
  defaultValues,
  allMetadataBlocksInfo,
  allFacetableMetadataFields,
  defaultCollectionFacets
}: CollectionFormProps) => {
  const formContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('createCollection')
  const navigate = useNavigate()

  const { submitForm, submitError, submissionStatus } = useSubmitCollection(
    collectionRepository,
    ownerCollectionId,
    onSubmittedCollectionError
  )

  const form = useForm<CollectionFormData>({
    mode: 'onChange',
    defaultValues
  })

  const { formState } = form

  const preventEnterSubmit = (e: React.KeyboardEvent<HTMLFormElement | HTMLButtonElement>) => {
    // When pressing Enter, only submit the form  if the user is focused on the submit button itself
    if (e.key !== 'Enter') return

    const isButton = e.target instanceof HTMLButtonElement
    const isButtonTypeSubmit = isButton ? (e.target as HTMLButtonElement).type === 'submit' : false

    if (!isButton && !isButtonTypeSubmit) e.preventDefault()
  }

  function onSubmittedCollectionError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCancel = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    navigate(-1)
  }

  const disableSubmitButton = useMemo(() => {
    return submissionStatus === SubmissionStatus.IsSubmitting || !formState.isDirty
  }, [submissionStatus, formState.isDirty])

  return (
    <div
      className={styles['form-container']}
      ref={formContainerRef}
      data-testid="collection-form-container">
      {submissionStatus === SubmissionStatus.Errored && (
        <Alert variant={'danger'} dismissible={false}>
          {submitError}
        </Alert>
      )}
      {submissionStatus === SubmissionStatus.SubmitComplete && (
        <Alert variant="success" dismissible={false}>
          {t('submitStatus.success')}
        </Alert>
      )}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          onKeyDown={preventEnterSubmit}
          noValidate={true}
          data-testid="collection-form">
          <TopFieldsSection />

          <SeparationLine />

          <Stack>
            <Card>
              <Card.Body>
                <MetadataFieldsSection
                  defaultValues={defaultValues}
                  allMetadataBlocksInfo={allMetadataBlocksInfo}
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <BrowseSearchFacetsSection
                  defaultCollectionFacets={defaultCollectionFacets}
                  allFacetableMetadataFields={allFacetableMetadataFields}
                />
              </Card.Body>
            </Card>
          </Stack>

          <Stack direction="horizontal" className="pt-3">
            <Button type="submit" disabled={disableSubmitButton}>
              {t('formButtons.save')}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
              {t('formButtons.cancel')}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </div>
  )
}
