import { DatasetDTO, initialDatasetDTO } from './DTOs/DatasetDTO'
const TITLE_REQUIRED = 'Title is required.'

export interface DatasetValidationResponse {
  isValid: boolean
  errors: DatasetDTO
}

export function validateDataset(dataset: DatasetDTO) {
  const errors: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO
  let isValid = true

  if (!dataset.metadataBlocks[0].fields.title) {
    errors.metadataBlocks[0].fields.title = TITLE_REQUIRED
    isValid = false
  }

  const validationResponse: DatasetValidationResponse = {
    isValid: isValid,
    errors
  }

  return validationResponse
}
