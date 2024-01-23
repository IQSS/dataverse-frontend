export interface CreateDatasetFormFields {
  createDatasetTitle: string
}

export interface ValidateCreateDataset {
  isValid: boolean
  errors: Record<keyof CreateDatasetFormFields, string | undefined>
}

export interface FormValidation {
  validateCreateDataset: (fields: CreateDatasetFormFields) => ValidateCreateDataset
}

export const formValidation: FormValidation = {
  validateCreateDataset: (fields: CreateDatasetFormFields): ValidateCreateDataset => {
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

export interface FormSubmission {
  createDataset: (fields: CreateDatasetFormFields) => Promise<void>
}
export const formSubmission: FormSubmission = {
  createDataset: async (fields: CreateDatasetFormFields): Promise<void> => {
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
