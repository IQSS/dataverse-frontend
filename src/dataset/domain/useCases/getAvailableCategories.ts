import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getAvailableCategories(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<string[]> {
  return datasetRepository.getAvailableCategories(datasetId)
}
