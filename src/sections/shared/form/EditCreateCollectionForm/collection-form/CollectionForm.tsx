import { MouseEvent, useMemo, useRef } from 'react'
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

export interface CollectionFormProps {
  mode: EditCreateCollectionFormMode
  collectionRepository: CollectionRepository
  collectionIdOrParentCollectionId: string
  defaultValues: CollectionFormData
  allMetadataBlocksInfo: MetadataBlockInfo[]
  allFacetableMetadataFields: MetadataField[]
  defaultCollectionFacets: CollectionFormFacet[]
}

export const CollectionForm = ({
  mode,
  collectionRepository,
  collectionIdOrParentCollectionId,
  defaultValues,
  allMetadataBlocksInfo,
  allFacetableMetadataFields,
  defaultCollectionFacets
}: CollectionFormProps) => {
  const formContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('createCollection')
  const navigate = useNavigate()

  const { submitForm, submitError, submissionStatus } = useSubmitCollection(
    mode,
    collectionIdOrParentCollectionId,
    collectionRepository,
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
                  allMetadataBlocksInfo={allMetadataBlocksInfo}
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
