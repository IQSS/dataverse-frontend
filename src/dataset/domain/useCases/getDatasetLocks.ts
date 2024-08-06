import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetLock } from '../models/Dataset'

export function getDatasetLocks(
  datasetRepository: DatasetRepository,
  persistentId: string
): Promise<DatasetLock[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      datasetRepository
        .getLocks(persistentId)
        .then(resolve)
        .catch((error: Error) => {
          reject(new Error(error.message))
        })
    }, 2000) // Delay of 2 seconds
  })
}
