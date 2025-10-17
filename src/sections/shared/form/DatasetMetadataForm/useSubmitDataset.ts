import { useState } from 'react'
import { toast } from 'react-toastify'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DatasetRepository } from '../../../../dataset/domain/repositories/DatasetRepository'
import { createDataset } from '../../../../dataset/domain/useCases/createDataset'
import { updateDatasetMetadata } from '../../../../dataset/domain/useCases/updateDatasetMetadata'
import { MetadataFieldsHelper, type DatasetMetadataFormValues } from './MetadataFieldsHelper'
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
  datasetLastUpdateTime?: string
): UseSubmitDatasetReturnType {
  const navigate = useNavigate()
  const { t } = useTranslation('shared', { keyPrefix: 'datasetMetadataForm' })
  const { t: tDataset } = useTranslation('dataset')

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [searchParams] = useSearchParams()

  const submitForm = (formData: DatasetMetadataFormValues): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const formDataBackToOriginalKeys = MetadataFieldsHelper.replaceSlashKeysWithDot(formData)

    const formattedFormValues = MetadataFieldsHelper.formatFormValuesToDatasetDTO(
      formDataBackToOriginalKeys,
      mode
    )

    if (mode === 'create') {
      let datasetType = 'dataset'
      const datasetTypeIn = searchParams.get(QueryParamKey.DATASET_TYPE)
      if (datasetTypeIn) {
        datasetType = datasetTypeIn
      }
      createDataset(datasetRepository, formattedFormValues, collectionId, datasetType)
        .then(({ persistentId }) => {
          setSubmitError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)
          toast.success(tDataset('alerts.datasetCreated.alertText'))
          navigate(
            `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${persistentId}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
          )
          return
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error && err.message
              ? MetadataFieldsHelper.getValidationFailedFieldError(err.message) ?? err.message
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
        datasetLastUpdateTime as string
      )
        .then(() => {
          setSubmitError(null)
          setSubmissionStatus(SubmissionStatus.SubmitComplete)
          toast.success(tDataset('alerts.metadataUpdated.alertText'))
          navigate(
            `${Route.DATASETS}?${QueryParamKey.PERSISTENT_ID}=${currentEditedDatasetPersistentID}&${QueryParamKey.VERSION}=${DatasetNonNumericVersionSearchParam.DRAFT}`
          )

          return
        })
        .catch((err) => {
          const errorMessage =
            err instanceof Error && err.message
              ? MetadataFieldsHelper.getValidationFailedFieldError(err.message) ?? err.message
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
