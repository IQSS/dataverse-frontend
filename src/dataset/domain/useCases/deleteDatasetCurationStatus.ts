import { DatasetRepository } from '../repositories/DatasetRepository'

export async function deleteDatasetCurationStatus(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<void> {
  return datasetRepository.deleteCurationStatus(datasetId)
}
