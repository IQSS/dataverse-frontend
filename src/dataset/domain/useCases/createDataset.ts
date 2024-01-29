import { DatasetFormFields } from '../models/DatasetFormFields'
import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetJSDataverseRepository } from '../../infrastructure/repositories/DatasetJSDataverseRepository'

const repo = new DatasetJSDataverseRepository()
function createDatasetMockHelper(
  datasetRepository: DatasetRepository,
  formFieldsToSubmit: DatasetFormFields
): Promise<string> {
  return datasetRepository.createDataset(formFieldsToSubmit).catch((error: Error) => {
    throw new Error(error.message)
  })
}

export function createDataset(fields: DatasetFormFields): Promise<string> {
  return createDatasetMockHelper(repo, fields)
}
