import { DatasetDTO, initialDatasetDTO } from './DTOs/DatasetDTO'
import { DatasetMetadataFieldValue, DatasetMetadataSubField } from '../models/Dataset'

const TITLE_REQUIRED = 'Title is required.'
const AUTHOR_NAME_REQUIRED = 'Author name is required.'
const DESCRIPTION_TEXT_REQUIRED = 'Description text is required.'
const SUBJECT_REQUIRED = 'Subject is required.'

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

  if (
    isArrayOfSubfieldValue(dataset.metadataBlocks[0].fields.author) &&
    !dataset.metadataBlocks[0].fields.author[0].authorName
  ) {
    if (isArrayOfSubfieldValue(errors.metadataBlocks[0].fields.author)) {
      errors.metadataBlocks[0].fields.author[0].authorName = AUTHOR_NAME_REQUIRED
      isValid = false
    }
  }

  if (
    isArrayOfSubfieldValue(dataset.metadataBlocks[0].fields.dsDescription) &&
    !dataset.metadataBlocks[0].fields.dsDescription[0].dsDescriptionValue
  ) {
    if (isArrayOfSubfieldValue(errors.metadataBlocks[0].fields.dsDescription)) {
      errors.metadataBlocks[0].fields.dsDescription[0].dsDescriptionValue =
        DESCRIPTION_TEXT_REQUIRED
      isValid = false
    }
  }

  if (
    isArrayOfString(dataset.metadataBlocks[0].fields.subject) &&
    !dataset.metadataBlocks[0].fields.subject.some((subject) => !!subject)
  ) {
    if (isArrayOfString(errors.metadataBlocks[0].fields.subject)) {
      errors.metadataBlocks[0].fields.subject[0] = SUBJECT_REQUIRED
      isValid = false
    }
  }

  const validationResponse: DatasetValidationResponse = {
    isValid: isValid,
    errors
  }

  return validationResponse
}

function isArrayOfSubfieldValue(
  metadataFieldValue: DatasetMetadataFieldValue
): metadataFieldValue is DatasetMetadataSubField[] {
  if (Array.isArray(metadataFieldValue)) {
    return metadataFieldValue.length > 0 && typeof metadataFieldValue[0] !== 'string'
  }
  return false
}

function isArrayOfString(
  metadataFieldValue: DatasetMetadataFieldValue
): metadataFieldValue is string[] {
  if (Array.isArray(metadataFieldValue)) {
    return metadataFieldValue.some((field) => typeof field === 'string')
  }
  return false
}
