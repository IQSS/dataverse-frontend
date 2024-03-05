import { useState } from 'react'
import {
  DatasetValidationResponse,
  validateDataset
} from '../../dataset/domain/useCases/validateDataset'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'

export const initialState: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO
export const useDatasetValidator = (): {
  validationErrors: DatasetDTO
  datasetIsValid: (formData: DatasetDTO) => boolean
} => {
  const [validationErrors, setValidationErrors] = useState(initialState)

  const datasetIsValid = (formData: DatasetDTO): boolean => {
    const validationResult: DatasetValidationResponse = validateDataset(formData)

    setValidationErrors(validationResult.errors)

    return validationResult.isValid
  }

  return {
    datasetIsValid,
    validationErrors
  }
}
