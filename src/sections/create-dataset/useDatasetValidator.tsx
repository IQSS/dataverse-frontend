import { useState } from 'react'
import {
  DatasetValidationResponse,
  validateDataset
} from '../../dataset/domain/useCases/validateDataset'
import { DatasetDTO, initialDatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import _ from 'lodash'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'

export const initialState: DatasetDTO = JSON.parse(JSON.stringify(initialDatasetDTO)) as DatasetDTO
export const useDatasetValidator = (): {
  validationErrors: DatasetDTO
  datasetIsValid: (formData: DatasetDTO) => boolean
  addErrorField: (path: string, index: number) => void
  removeErrorField: (path: string, index: number) => void
} => {
  const [validationErrors, setValidationErrors] = useState(initialState)

  const datasetIsValid = (formData: DatasetDTO): boolean => {
    const validationResult: DatasetValidationResponse = validateDataset(formData)

    setValidationErrors(validationResult.errors)

    return validationResult.isValid
  }
  const addErrorField = (path: string, index: number) => {
    const updatedFormData = _.cloneDeep(validationErrors)
    const arrayAtPath: DatasetMetadataSubField[] = _.get(
      updatedFormData,
      path
    ) as DatasetMetadataSubField[]

    arrayAtPath.splice(index, 0, { authorName: '' })
    _.set(updatedFormData, path, arrayAtPath)

    setValidationErrors(updatedFormData)
    console.log('added field' + JSON.stringify(updatedFormData.metadataBlocks[0].fields['author']))
  }
  const removeErrorField = (path: string, index: number) => {
    const updatedFormData = _.cloneDeep(validationErrors)
    const arrayAtPath: string[] = _.get(updatedFormData, path) as string[]
    arrayAtPath.splice(index, 1)
    _.set(updatedFormData, path, arrayAtPath)
    setValidationErrors(updatedFormData)
  }
  return {
    datasetIsValid,
    validationErrors,
    addErrorField,
    removeErrorField
  }
}
