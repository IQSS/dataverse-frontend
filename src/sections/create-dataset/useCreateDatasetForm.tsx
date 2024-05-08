import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { MetadataFieldsHelper } from './MetadataFieldsHelper'
import { Route } from '../Route.enum'

export enum SubmissionStatus {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

// TODO:ME FormDefaultValues not matching FormCollectedValues, refactor

type FormDefaultValues = Record<
  string,
  Record<string, string | Record<string, string> | Record<string, string>[]>
>

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
    console.log({ formData })
    // setSubmissionStatus(SubmissionStatus.IsSubmitting)

    // const formDataBackToOriginalKeys = MetadataFieldsHelper.replaceSlashKeysWithDot(
    //   formData
    // ) as FormCollectedValues
    // const formattedFormValues = MetadataFieldsHelper.formatFormValuesToCreateDatasetDTO(
    //   formDataBackToOriginalKeys
    // )

    // createDataset(repository, formattedFormValues)
    //   .then(({ persistentId }) => {
    //     setSubmissionStatus(SubmissionStatus.SubmitComplete)
    //     navigate(`${Route.DATASETS}?persistentId=${persistentId}`, {
    //       state: { created: true }
    //     })
    //     return
    //   })
    //   .catch((e) => {
    //     console.error(e)
    //     setSubmissionStatus(SubmissionStatus.Errored)
    //   })
  }

  return {
    submissionStatus,
    submitForm
  }
}
