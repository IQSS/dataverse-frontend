import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetDTO } from './DTOs/DatasetDTO'

export function createDataset(
  datasetRepository: DatasetRepository,
  dataset: DatasetDTO
): Promise<{ persistentId: string }> {
  return datasetRepository.create(dataset).catch((error: Error) => {
    throw new Error(error.message)
  })
}
