import { DatasetFormFields } from '../models/DatasetFormFields'
import { DatasetValidationResponse } from '../models/DatasetValidationResponse'
const NAME_REQUIRED = 'Name is required'

export function validateDataset(fieldsToSubmit: DatasetFormFields) {
  const errors: Record<keyof DatasetFormFields, string | undefined> = {
    createDatasetTitle: undefined
  }

  if (!fieldsToSubmit.createDatasetTitle) {
    errors.createDatasetTitle = NAME_REQUIRED
  }

  const validationResponse: DatasetValidationResponse = {
    isValid: Object.values(errors).every((error) => error === undefined),
    errors
  }
  return validationResponse
}
