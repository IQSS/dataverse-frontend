import { useMemo, useRef } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Alert, Button, Card, Stack } from '@iqss/dataverse-design-system'
import { CollectionRepository } from '@/collection/domain/repositories/CollectionRepository'
import { CollectionFormData, CollectionFormFacet } from '../types'
import {
  MetadataBlockInfo,
  MetadataField
} from '@/metadata-block-info/domain/models/MetadataBlockInfo'
import { SubmissionStatus, useSubmitCollection } from './useSubmitCollection'
import styles from './CollectionForm.module.scss'
import { TopFieldsSection } from './top-fields-section/TopFieldsSection'
import { SeparationLine } from '@/sections/shared/layout/SeparationLine/SeparationLine'
import { MetadataFieldsSection } from './metadata-fields-section/MetadataFieldsSection'
import { BrowseSearchFacetsSection } from './browse-search-facets-section/BrowseSearchFacetsSection'
import { EditCreateCollectionFormMode } from '../EditCreateCollectionForm'
import { RouteWithParams } from '@/sections/Route.enum'

export interface CollectionFormProps {
  mode: EditCreateCollectionFormMode
  collectionRepository: CollectionRepository
  collectionIdOrParentCollectionId: string
  defaultValues: CollectionFormData
  allMetadataBlocksInfo: MetadataBlockInfo[]
  allFacetableMetadataFields: MetadataField[]
  defaultCollectionFacets: CollectionFormFacet[]
  isEditingRootCollection: boolean
}

export const CollectionForm = ({
  mode,
  collectionRepository,
  collectionIdOrParentCollectionId,
  defaultValues,
  allMetadataBlocksInfo,
  allFacetableMetadataFields,
  defaultCollectionFacets,
  isEditingRootCollection
}: CollectionFormProps) => {
  const formContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('shared', { keyPrefix: 'collectionForm' })
  const navigate = useNavigate()
  const onCreateMode = mode === 'create'

  const form = useForm<CollectionFormData>({
    mode: 'onChange',
    defaultValues
  })

  const { formState } = form

  const { submitForm, submitError, submissionStatus } = useSubmitCollection(
    mode,
    collectionIdOrParentCollectionId,
    collectionRepository,
    isEditingRootCollection,
    formState.dirtyFields,
    onSubmittedCollectionError
  )

  function onSubmittedCollectionError() {
    if (formContainerRef.current) {
      formContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const handleCancel = () => {
    navigate(RouteWithParams.COLLECTIONS(collectionIdOrParentCollectionId))
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
          {onCreateMode ? t('submitStatus.createSuccess') : t('submitStatus.editSuccess')}
        </Alert>
      )}
      <FormProvider {...form}>
        <form
          onSubmit={form.handleSubmit(submitForm)}
          noValidate={true}
          data-testid="collection-form">
          <TopFieldsSection isEditingRootCollection={isEditingRootCollection} />

          <SeparationLine />

          <Stack>
            <Card>
              <Card.Body>
                <MetadataFieldsSection
                  defaultValues={defaultValues}
                  allMetadataBlocksInfo={allMetadataBlocksInfo}
                  isEditingRootCollection={isEditingRootCollection}
                />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <BrowseSearchFacetsSection
                  defaultCollectionFacets={defaultCollectionFacets}
                  allFacetableMetadataFields={allFacetableMetadataFields}
                  allMetadataBlocksInfo={allMetadataBlocksInfo}
                  isEditingRootCollection={isEditingRootCollection}
                />
              </Card.Body>
            </Card>
          </Stack>

          <Stack direction="horizontal" className="pt-3">
            <Button type="submit" disabled={disableSubmitButton}>
              {onCreateMode ? t('saveButton.createMode') : t('saveButton.editMode')}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={handleCancel}
              disabled={submissionStatus === SubmissionStatus.IsSubmitting}>
              {t('cancelButton')}
            </Button>
          </Stack>
        </form>
      </FormProvider>
    </div>
  )
}
