import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getDatasetAvailableCategories(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<string[]> {
  return datasetRepository.getDatasetAvailableCategories(datasetId)
}
