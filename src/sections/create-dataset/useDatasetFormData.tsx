import { useState } from 'react'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import _ from 'lodash'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'

const initialState: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO
export const useDatasetFormData = (
  datasetIsValid: (formData: DatasetDTO) => boolean
): {
  formData: DatasetDTO
  updateFormData: (name: string, value: string | DatasetMetadataSubField[]) => void
} => {
  const [formData, setFormData] = useState(initialState)

  const updateFormData = (name: string, value: string | DatasetMetadataSubField[]) => {
    const updatedFormData = _.cloneDeep(getUpdatedFormData(formData, name, value))
    setFormData(updatedFormData)
    datasetIsValid(updatedFormData)
  }

  const getUpdatedFormData = (
    currentFormData: DatasetDTO,
    name: string,
    value: string | DatasetMetadataSubField[]
  ): DatasetDTO => {
    const objectFromPath: DatasetDTO = initialState

    _.set(objectFromPath, name, value)
    cleanArray(objectFromPath, name)

    return objectFromPath
  }

  return {
    formData,
    updateFormData
  }
}

function cleanArray(object: DatasetDTO, path: string) {
  const arrayPath = path.split('.').slice(0, -1).join('.')
  const existingArray: string[] = _.get(object, arrayPath) as string[]

  if (Array.isArray(existingArray)) {
    const cleanedArray = existingArray.filter((item) => item !== undefined && item !== '')
    _.set(object, arrayPath, cleanedArray)
  }
}
