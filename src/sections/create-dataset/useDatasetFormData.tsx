import { useState } from 'react'
import {
  DatasetValidationResponse,
  validateDataset
} from '../../dataset/domain/useCases/validateDataset'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'

export type DatasetFormData = DatasetDTO
export const initialState: DatasetFormData = { ...initialDatasetDTO }

export const useDatasetFormData = (): {
  formData: DatasetFormData
  formDataErrors: Partial<DatasetFormData>
  updateFormData: (value: Partial<DatasetFormData>) => void
} => {
  const [formData, setFormData] = useState(initialState)
  const [formDataErrors, setFormDataErrors] = useState(initialState)

  const updateFormData = (value: Partial<typeof initialState>) => {
    const updatedFormData = { ...formData, ...value }
    setFormData(updatedFormData)

    validateFormData(updatedFormData)
  }

  const validateFormData = (formData: DatasetFormData) => {
    const validationResult: DatasetValidationResponse = validateDataset(formData)

    setFormDataErrors(validationResult.errors)
  }

  return {
    formData,
    formDataErrors,
    updateFormData
  }
}
