import { DatasetDTO, initialDatasetDTO } from './DTOs/DatasetDTO'
const NAME_REQUIRED = 'Name is required'

export interface DatasetValidationResponse {
  isValid: boolean
  errors: DatasetDTO
}

export function validateDataset(dataset: DatasetDTO) {
  const errors: DatasetDTO = { ...initialDatasetDTO }

  if (!dataset.title) {
    errors.title = NAME_REQUIRED
  }

  const validationResponse: DatasetValidationResponse = {
    isValid: Object.values(errors).every((error) => error !== ''),
    errors
  }

  return validationResponse
}
