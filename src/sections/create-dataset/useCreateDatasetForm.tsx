import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { formatFormValuesToCreateDatasetDTO, replaceSlashKeysWithDot } from './utils'
import { FieldValues } from 'react-hook-form'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { Route } from '../Route.enum'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export function useCreateDatasetForm(repository: DatasetRepository): {
  submissionStatus: SubmissionStatus
  submitForm: (formData: FieldValues) => void
} {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const navigate = useNavigate()

  const submitForm = (formData: FieldValues): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    const formDataBackToOriginalKeys = replaceSlashKeysWithDot(formData)
    const formattedFormValues = formatFormValuesToCreateDatasetDTO(formDataBackToOriginalKeys)

    console.log(formattedFormValues)

    createDataset(repository, formattedFormValues as DatasetDTO)
      .then(({ persistentId }) => {
        console.log({ persistentId })
        setSubmissionStatus(SubmissionStatus.SubmitComplete)
        navigate(`${Route.DATASETS}?persistentId=${persistentId}`)
        return
      })
      .catch(() => {
        setSubmissionStatus(SubmissionStatus.Errored)
      })
  }

  return {
    submissionStatus,
    submitForm
  }
}
