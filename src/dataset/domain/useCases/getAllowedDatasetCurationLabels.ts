import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getAllowedDatasetCurationLabels(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<string[]> {
  return datasetRepository.getAllowedCurationLabels(datasetId)
}
