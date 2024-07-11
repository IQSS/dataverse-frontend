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
import { SeparationLine } from '../../shared/layout/SeparationLine/SeparationLine'
import { SubmissionStatus, useSubmitCollection } from './useSubmitCollection'
import { TopFieldsSection } from './top-fields-section'
import { MetadataFieldsSection } from './metadata-fields-section'
import { BrowseSearchFacetsSection } from './browse-search-facets-section'
import styles from './CollectionForm.module.scss'

export interface CollectionFormProps {
  collectionRepository: CollectionRepository
  defaultValues: Partial<CollectionFormData>
}

export type CollectionFormData = {
  hostCollection: string
  name: string
  affiliation?: string
  alias: string
  storage?: CollectionStorage
  type: CollectionType
  description?: string
  contacts: { value: string }[]
}

export const CollectionForm = ({ collectionRepository, defaultValues }: CollectionFormProps) => {
  const formContainerRef = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('newCollection')
  const navigate = useNavigate()

  const { submitForm, submitError, submissionStatus } = useSubmitCollection(
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

  // TODO:ME Apply max width to container
  return (
    <div className={styles['form-container']} ref={formContainerRef} data-testid="collection-form">
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
          noValidate={true}>
          <TopFieldsSection />

          <SeparationLine />

          <Stack>
            <Card>
              <Card.Body>
                <MetadataFieldsSection />
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <BrowseSearchFacetsSection />
              </Card.Body>
            </Card>
          </Stack>

          <Stack direction="horizontal" className="pt-3">
            <Button
              type="submit"
              // disabled={disableSubmitButton}
            >
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
