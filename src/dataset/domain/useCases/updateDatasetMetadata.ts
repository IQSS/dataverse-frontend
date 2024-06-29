import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetDTO } from './DTOs/DatasetDTO'

export function updateDatasetMetadata(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  updatedDataset: DatasetDTO
): Promise<void> {
  return datasetRepository.updateMetadata(datasetId, updatedDataset).catch((error: Error) => {
    throw new Error(error.message)
  })
}
