import { DatasetCurationStatus } from '../models/DatasetCuration'
import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getDatasetCurationStatus(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<DatasetCurationStatus | null> {
  return datasetRepository.getCurationStatus(datasetId)
}
