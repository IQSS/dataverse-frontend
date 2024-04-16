import { useState } from 'react'
import _ from 'lodash'
import { DatasetMetadataSubField } from '../../dataset/domain/models/Dataset'

export function useMultipleFields(initialFields: DatasetMetadataSubField[]) {
  const [multipleFields, setMultipleFields] = useState(initialFields)

  const addField = (index: number, newField: DatasetMetadataSubField) => {
    const updatedFields = _.cloneDeep(multipleFields)
    updatedFields.splice(index + 1, 0, newField)
    setMultipleFields(updatedFields)
  }

  const removeField = (index: number) => {
    const updatedFields = _.cloneDeep(multipleFields)
    updatedFields.splice(index, 1)
    setMultipleFields(updatedFields)
  }

  return { multipleFields, setMultipleFields, addField, removeField }
}
