import { DatasetCurationStatus } from '../models/DatasetCuration'
import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getDatasetCurationStatusHistory(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<DatasetCurationStatus[]> {
  return datasetRepository.getCurationStatusHistory(datasetId)
}
