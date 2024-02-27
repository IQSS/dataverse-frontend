import { useState } from 'react'
import {
  DatasetValidationResponse,
  validateDataset
} from '../../dataset/domain/useCases/validateDataset'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'

export type DatasetFormData = DatasetDTO
export const initialState: DatasetFormData = JSON.parse(
  JSON.stringify(initialDatasetDTO)
) as DatasetFormData

export const useDatasetFormData = (): {
  formData: DatasetFormData
  formDataErrors: DatasetFormData
  updateFormData: (name: string, value: string) => void
} => {
  const [formData, setFormData] = useState(initialState)
  const [formDataErrors, setFormDataErrors] = useState(initialState)

  const updateFormData = (name: string, value: string) => {
    const updatedFormData = getUpdatedFormData(name, value)
    setFormData(updatedFormData)

    validateFormData(updatedFormData)
  }

  const validateFormData = (formData: DatasetFormData) => {
    const validationResult: DatasetValidationResponse = validateDataset(formData)

    setFormDataErrors(validationResult.errors)
  }

  const getUpdatedFormData = (name: string, value: string): DatasetFormData => {
    const matches = name.match(/metadataBlocks\[(\d+)\]\.fields\.(.+)/)

    if (matches) {
      const [_, blockIndex, fieldName] = matches
      const updatedFormData = { ...formData }

      updatedFormData.metadataBlocks = updatedFormData.metadataBlocks.map((block, index) => {
        return index === parseInt(blockIndex, 10)
          ? { ...block, fields: { ...block.fields, [fieldName]: value } }
          : block
      })
      return updatedFormData
    }
    return { ...formData, [name]: value }
  }

  return {
    formData,
    formDataErrors,
    updateFormData
  }
}
