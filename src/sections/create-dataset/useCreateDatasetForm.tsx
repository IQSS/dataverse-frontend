import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
// import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
// import { Route } from '../Route.enum'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export function useCreateDatasetForm(_repository: DatasetRepository): {
  submissionStatus: SubmissionStatus
  submitForm: (formData: Record<string, unknown>) => void
} {
  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatus>(
    SubmissionStatus.NotSubmitted
  )
  const _navigate = useNavigate()

  const submitForm = (formData: Record<string, unknown>): void => {
    setSubmissionStatus(SubmissionStatus.IsSubmitting)

    console.log({ formData })

    // createDataset(repository, formData)
    //   .then(({ persistentId }) => {
    //     setSubmissionStatus(SubmissionStatus.SubmitComplete)
    //     navigate(`${Route.DATASETS}?persistentId=${persistentId}`)
    //     return
    //   })
    //   .catch(() => {
    //     setSubmissionStatus(SubmissionStatus.Errored)
    //   })
  }

  return {
    submissionStatus,
    submitForm
  }
}
