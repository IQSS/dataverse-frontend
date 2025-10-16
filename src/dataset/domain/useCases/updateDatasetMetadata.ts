import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetDTO } from './DTOs/DatasetDTO'

export function updateDatasetMetadata(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  updatedDataset: DatasetDTO,
  sourceLastUpdateTime?: string
): Promise<void> {
  return datasetRepository
    .updateMetadata(datasetId, updatedDataset, sourceLastUpdateTime)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
