import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetDTO } from './DTOs/DatasetDTO'

export function createDataset(
  datasetRepository: DatasetRepository,
  dataset: DatasetDTO,
  collectionId: string
): Promise<{ persistentId: string }> {
  return datasetRepository.create(dataset, collectionId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
