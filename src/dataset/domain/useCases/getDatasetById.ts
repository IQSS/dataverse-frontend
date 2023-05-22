import { DatasetRepository } from '../repositories/DatasetRepository'
import { Dataset } from '../models/Dataset'

export async function getDatasetById(
  datasetRepository: DatasetRepository,
  datasetId: string
): Promise<Dataset | undefined> {
  return datasetRepository.getById(datasetId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
