import { useState } from 'react'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'

const initialState: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO
export const useDatasetFormData = (
  datasetIsValid: (formData: DatasetDTO) => boolean
): {
  formData: DatasetDTO
  updateFormData: (name: string, value: string) => void
} => {
  const [formData, setFormData] = useState(initialState)

  const updateFormData = (name: string, value: string) => {
    const updatedFormData = getUpdatedFormData(name, value)

    setFormData(updatedFormData)
    datasetIsValid(updatedFormData)
  }

  const getUpdatedFormData = (name: string, value: string): DatasetDTO => {
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
    updateFormData
  }
}
