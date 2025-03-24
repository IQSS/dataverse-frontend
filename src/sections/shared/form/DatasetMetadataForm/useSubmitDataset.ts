import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { createDataset } from '../../../../dataset/domain/useCases/createDataset'
import { updateDatasetMetadata } from '../../../../dataset/domain/useCases/updateDatasetMetadata'
import { MetadataFieldsHelper, type DatasetMetadataFormValues } from './MetadataFieldsHelper'
import { getValidationFailedFieldError } from '../../../../metadata-block-info/domain/models/fieldValidations'
import { type DatasetMetadataFormMode } from '.'
import { QueryParamKey, Route } from '../../../Route.enum'
import { DatasetNonNumericVersionSearchParam } from '../../../../dataset/domain/models/Dataset'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

type UseSubmitDatasetReturnType =
  | {
      submissionStatus:
        | SubmissionStatus.NotSubmitted
        | SubmissionStatus.IsSubmitting
        | SubmissionStatus.SubmitComplete
      submitForm: (formData: DatasetMetadataFormValues) => void
      submitError: null
    }
  | {
      submissionStatus: SubmissionStatus.Errored
      submitForm: (formData: DatasetMetadataFormValues) => void
      submitError: string
    }

export function useSubmitDataset(
  mode: DatasetMetadataFormMode,
  collectionId: string,
  datasetRepository: DatasetRepository,
  onSubmitErrorCallback: () => void,
  datasetPersistentID?: string,
  datasetInternalVersionNumber?: number
): UseSubmitDatasetReturnType {
  const navigate = useNavigate()
  const { t } = useTranslation('shared', { keyPrefix: 'datasetMetadataForm' })

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const submitForm = (formData: DatasetMetadataFormValues): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const formDataBackToOriginalKeys = MetadataFieldsHelper.replaceSlashKeysWithDot(formData)

    const formattedFormValues = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
      formDataBackToOriginalKeys,
      mode
    )

    if (mode === 'create') {
      createDataset(datasetRepository, formattedFormValues, collectionId)
        .then(({ persistentId }) => {
          setSubmitError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)
          navigate(
            `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${persistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`,
            {
              state: { created: true }
            }
          )
          return
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error && err.message
              ? getValidationFailedFieldError(err.message) ?? err.message
              : t('validationAlert.content')

          setSubmitError(errorMessage)
          setSubmissionStatus(SubmissionStatus.Errored)

          onSubmitErrorCallback()
        })
    } else {
      const currentEditedDatasetPersistentID = datasetPersistentID as string

      updateDatasetMetadata(
        datasetRepository,
        currentEditedDatasetPersistentID,
        formattedFormValues,
        datasetInternalVersionNumber as number
      )
        .then(() => {
          setSubmitError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)
          navigate(
            `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${currentEditedDatasetPersistentID}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`,
            {
              state: { metadataUpdated: true }
            }
          )

          return
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error && err.message
              ? getValidationFailedFieldError(err.message) ?? err.message
              : t('validationAlert.content')

          setSubmitError(errorMessage)
          setSubmissionStatus(SubmissionStatus.Errored)

          onSubmitErrorCallback()
        })
    }
  }

  return {
    submissionStatus,
    submitForm,
    submitError
  } as UseSubmitDatasetReturnType
}
