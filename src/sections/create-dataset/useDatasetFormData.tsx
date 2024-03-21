import { useState } from 'react'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import _ from 'lodash'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'

const initialState: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO
export const useDatasetFormData = (
  datasetIsValid: (formData: DatasetDTO) => boolean
): {
  formData: DatasetDTO
  updateFormData: (name: string, value: string) => void
  addField: (path: string, index: number) => void
  removeField: (path: string, index: number) => void
} => {
  const [formData, setFormData] = useState(initialState)

  const updateFormData = (name: string, value: string) => {
    const updatedFormData = _.cloneDeep(getUpdatedFormData(formData, name, value))
    console.log('updatedFormData' + JSON.stringify(updatedFormData))
    setFormData(updatedFormData)
    datasetIsValid(updatedFormData)
  }
  const addField = (path: string, index: number) => {
    const updatedFormData = _.cloneDeep(formData)
    const arrayAtPath: DatasetMetadataSubField[] = _.get(
      updatedFormData,
      path
    ) as DatasetMetadataSubField[]

    arrayAtPath.splice(index, 0, { authorName: '' })
    _.set(updatedFormData, path, arrayAtPath)

    setFormData(updatedFormData)
    console.log('added field' + JSON.stringify(updatedFormData.metadataBlocks[0].fields['author']))
  }
  const removeField = (path: string, index: number) => {
    const updatedFormData = _.cloneDeep(formData)
    const arrayAtPath: string[] = _.get(updatedFormData, path) as string[]
    arrayAtPath.splice(index, 1)
    _.set(updatedFormData, path, arrayAtPath)
    setFormData(updatedFormData)
    // datasetIsValid(updatedFormData)
  }

  const getUpdatedFormData = (
    currentFormData: DatasetDTO,
    name: string,
    value: string
  ): DatasetDTO => {
    const objectFromPath: DatasetDTO = initialState

    _.set(objectFromPath, name, value)
    cleanArray(objectFromPath, name)

    return objectFromPath
  }

  return {
    formData,
    updateFormData,
    addField,
    removeField
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
