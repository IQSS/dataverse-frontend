export interface CreateDatasetFormFields {
  createDatasetTitle: string
}

export interface FormValidationResult {
  isValid: boolean
  errors: Record<keyof CreateDatasetFormFields, string | undefined>
}

export interface FormValidationService {
  validateForm: (fields: CreateDatasetFormFields) => FormValidationResult
}

export const formValidationService: FormValidationService = {
  validateForm: (fields: CreateDatasetFormFields): FormValidationResult => {
    const errors: Record<keyof CreateDatasetFormFields, string | undefined> = {
      createDatasetTitle: undefined
    }

    if (!fields.createDatasetTitle) {
      errors.createDatasetTitle = 'Name is required'
    }

    return {
      isValid: Object.values(errors).every((error) => error === undefined),
      errors
    }
  }
}

export interface FormSubmissionService {
  submitFormData: (fields: CreateDatasetFormFields) => Promise<void>
}
export const formSubmissionService: FormSubmissionService = {
  submitFormData: async (fields: CreateDatasetFormFields): Promise<void> => {
    console.log('Submitting form data:', fields)
    const sendDataMock = (fields: CreateDatasetFormFields) => {
      const delay = 2000
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve('Form Data Submitted: ' + JSON.stringify(fields))
        }, delay)
      })
    }
    await sendDataMock(fields)
  }
}
