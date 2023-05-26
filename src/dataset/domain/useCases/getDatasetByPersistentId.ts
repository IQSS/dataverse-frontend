import { DatasetRepository } from '../repositories/DatasetRepository'
import { Dataset } from '../models/Dataset'

export async function getDatasetByPersistentId(
  datasetRepository: DatasetRepository,
  persistentId: string
): Promise<Dataset | undefined> {
  return datasetRepository.getByPersistentId(persistentId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
