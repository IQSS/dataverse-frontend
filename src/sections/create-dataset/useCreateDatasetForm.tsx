import { useState } from 'react'
import {
  CreateDatasetFormFields,
  FormValidationResult,
  formSubmission,
  formValidation
} from '../../dataset/domain/useCases/createDataset'

interface FormContextInterface {
  fields: CreateDatasetFormFields
}

const defaultFormState: CreateDatasetFormFields = {
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
  const [formErrors, setFormErrors] = useState<
    Record<keyof CreateDatasetFormFields, string | undefined>
  >({ createDatasetTitle: undefined })

  const updateFormData = (updatedFormData: object) => {
    setFormState((prevState) => ({
      ...prevState,
      fields: { ...prevState.fields, ...updatedFormData }
    }))
  }

  const submitFormData = () => {
    setSubmissionStatus(SubmissionStatusEnums.IsSubmitting)

    const validationResult: FormValidationResult = formValidation.validateForm(formState.fields)

    if (validationResult.isValid) {
      formSubmission
        .submitFormData(formState.fields)
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
