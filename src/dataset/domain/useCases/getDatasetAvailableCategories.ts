import { ReadError } from '@iqss/dataverse-client-javascript'
import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getDatasetAvailableCategories(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<string[]> {
  return datasetRepository.getDatasetAvailableCategories(datasetId).catch((error: ReadError) => {
    throw new Error(error.message)
  })
}
