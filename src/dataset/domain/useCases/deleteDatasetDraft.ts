import { DatasetRepository } from '../repositories/DatasetRepository'

export function deleteDatasetDraft(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<void> {
  return datasetRepository.deleteDatasetDraft(datasetId)
}
