import { DatasetDTO, initialDatasetDTO } from './DTOs/DatasetDTO'
const NAME_REQUIRED = 'Name is required'

export interface DatasetValidationResponse {
  isValid: boolean
  errors: DatasetDTO
}

export function validateDataset(dataset: DatasetDTO) {
  const errors: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO

  if (!dataset.metadataBlocks[0].fields.title) {
    errors.metadataBlocks[0].fields.title = NAME_REQUIRED
  }

  const validationResponse: DatasetValidationResponse = {
    isValid: Object.values(errors).every((error) => error !== ''),
    errors
  }

  return validationResponse
}
