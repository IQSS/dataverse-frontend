import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetDTO } from './DTOs/DatasetDTO'
import { DatasetType } from '../models/DatasetType'

export function createDataset(
  datasetRepository: DatasetRepository,
  dataset: DatasetDTO,
  collectionId: string,
  datasetType?: DatasetType['name']
): Promise<{ persistentId: string }> {
  return datasetRepository.create(dataset, collectionId, datasetType).catch((error: Error) => {
    throw new Error(error.message)
  })
}
