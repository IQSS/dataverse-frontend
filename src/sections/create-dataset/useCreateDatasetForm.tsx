import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { type CreateDatasetFormValues, MetadataFieldsHelper } from './MetadataFieldsHelper'
import { Route } from '../Route.enum'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export function useCreateDatasetForm(
  repository: DatasetRepository,
  collectionId: string
): {
  submissionStatus: SubmissionStatus
  submitForm: (formData: CreateDatasetFormValues) => void
} {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const navigate = useNavigate()

  const submitForm = (formData: CreateDatasetFormValues): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const formDataBackToOriginalKeys = MetadataFieldsHelper.replaceSlashKeysWithDot(formData)

    const formattedFormValues = MetadataFieldsHelper.formatFormValuesToCreateDatasetDTO(
      formDataBackToOriginalKeys
    )

    createDataset(repository, formattedFormValues, collectionId)
      .then(({ persistentId }) => {
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        navigate(`${Route.DATASETS}?persistentId=${persistentId}`, {
          state: { created: true }
        })
        return
      })
      .catch((e) => {
        console.error(e)
        setSubmissionStatus(SubmissionStatus.Errored)
      })
  }

  return {
    submissionStatus,
    submitForm
  }
}
