import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { formatFormValuesToCreateDatasetDTO, replaceSlashKeysWithDot } from './utils'
import { Route } from '../Route.enum'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export type FormCollectedValues = Record<
  string,
  Record<string, string | string[] | FormCollectedComposedFields>
>
export type FormCollectedComposedFields = Record<string, string>

export function useCreateDatasetForm(repository: DatasetRepository): {
  submissionStatus: SubmissionStatus
  submitForm: (formData: FormCollectedValues) => void
} {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const navigate = useNavigate()

  const submitForm = (formData: FormCollectedValues): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const formDataBackToOriginalKeys = replaceSlashKeysWithDot(formData) as FormCollectedValues
    const formattedFormValues = formatFormValuesToCreateDatasetDTO(formDataBackToOriginalKeys)

    createDataset(repository, formattedFormValues)
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
