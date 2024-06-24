import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetLock } from '../models/Dataset'

export function publishDataset(
  datasetRepository: DatasetRepository,
  persistentId: string
): Promise<DatasetLock[]> {
  return datasetRepository.getLocks(persistentId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
