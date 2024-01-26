import { useState } from 'react'
import { DatasetFormFields } from '../../dataset/domain/models/DatasetFormFields'
import { createDataset } from '../../dataset/domain/useCases/createDataset'
import { validateDataset } from '../../dataset/domain/useCases/validateDataset'
import { DatasetValidationResponse } from '../../dataset/domain/models/DatasetValidationResponse'
interface FormContextInterface {
  fields: DatasetFormFields
}

const defaultFormState: DatasetFormFields = {
  createDatasetTitle: ''
}

export enum SubmissionStatusEnums {
  NotSubmitted = 'NotSubmitted',
  IsSubmitting = 'IsSubmitting',
  SubmitComplete = 'SubmitComplete',
  Errored = 'Errored'
}

export function useCreateDatasetForm() {
  const [formState, setFormState] = useState<FormContextInterface>({
    fields: defaultFormState
  })

  const [submissionStatus, setSubmissionStatus] = useState<SubmissionStatusEnums>(
    SubmissionStatusEnums.NotSubmitted
  )
  const [formErrors, setFormErrors] = useState<Record<keyof DatasetFormFields, string | undefined>>(
    { createDatasetTitle: undefined }
  )

  const updateFormData = (updatedFormData: object) => {
    setFormState((prevState) => ({
      ...prevState,
      fields: { ...prevState.fields, ...updatedFormData }
    }))
  }

  const submitFormData = () => {
    setSubmissionStatus(SubmissionStatusEnums.IsSubmitting)

    const validationResult: DatasetValidationResponse = validateDataset(formState.fields)

    if (validationResult.isValid) {
      createDataset(formState.fields)
        .then(() => setSubmissionStatus(SubmissionStatusEnums.IsSubmitting))
        .catch(() => setSubmissionStatus(SubmissionStatusEnums.Errored))
        .finally(() => setSubmissionStatus(SubmissionStatusEnums.SubmitComplete))
    } else {
      setFormErrors(validationResult.errors)
      setSubmissionStatus(SubmissionStatusEnums.Errored)
    }
  }

  return {
    formState,
    formErrors,
    submissionStatus,
    updateFormData,
    submitFormData
  }
}
