import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type CreateDatasetFormValues, MetadataFieldsHelper } from './MetadataFieldsHelper'
import { getValidationFailedFieldError } from '../../metadata-block-info/domain/models/fieldValidations'
import { Route } from '../Route.enum'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseCreateDatasetFormReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitForm: (formData: CreateDatasetFormValues) => void
      createError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitForm: (formData: CreateDatasetFormValues) => void
      createError: string
    }

export function useCreateDatasetForm(
  repository: DatasetRepository,
  collectionId: string,
  onCreateErrorCallback: () => void
): UseCreateDatasetFormReturnType {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [createError, setCreateError] = useState<string | null>(null)

  const navigate = useNavigate()

  const { t } = useTranslation('createDataset')

  const submitForm = (formData: CreateDatasetFormValues): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const formDataBackToOriginalKeys = MetadataFieldsHelper.replaceSlashKeysWithDot(formData)

    const formattedFormValues = MetadataFieldsHelper.formatFormValuesToCreateDatasetDTO(
      formDataBackToOriginalKeys
    )

    createDataset(repository, formattedFormValues, collectionId)
      .then(({ persistentId }) => {
        setCreateError(null)
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        navigate(`${Route.DATASETS}?persistentId=${persistentId}`, {
          state: { created: true }
        })
        return
      })
      .catch((err) => {
        const errorMessage =
          err instanceof Error && err.message
            ? getValidationFailedFieldError(err.message) ?? err.message
            : t('validationAlert.content')

        setCreateError(errorMessage)
        setSubmissionStatus(SubmissionStatus.Errored)

        onCreateErrorCallback()
      })
  }

  return {
    submissionStatus,
    submitForm,
    createError
  } as UseCreateDatasetFormReturnType
}
