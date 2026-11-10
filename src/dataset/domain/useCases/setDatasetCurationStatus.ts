import { DatasetRepository } from '../repositories/DatasetRepository'

export async function setDatasetCurationStatus(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  label: string
): Promise<void> {
  return datasetRepository.setCurationStatus(datasetId, label)
}
