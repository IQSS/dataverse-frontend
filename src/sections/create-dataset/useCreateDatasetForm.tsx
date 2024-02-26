import { useState } from 'react'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetFormData } from './useDatasetFormData'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export function useCreateDatasetForm(repository: DatasetRepository): {
  submissionStatus: SubmissionStatus
  submitForm: (formData: DatasetFormData) => void
} {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )

  const submitForm = (formData: DatasetFormData): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    createDataset(repository, formData)
      .then(() => setSubmissionStatus(SubmissionStatus.SubmitComplete))
      .catch(() => setSubmissionStatus(SubmissionStatus.Errored))
  }

  return {
    submissionStatus,
    submitForm
  }
}
