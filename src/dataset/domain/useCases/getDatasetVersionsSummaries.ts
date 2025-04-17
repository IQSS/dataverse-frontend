import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetVersionSummaryInfo } from '../models/DatasetVersionSummaryInfo'

export function getDatasetVersionsSummaries(
  datasetRepository: DatasetRepository,
  datasetId: number | string
): Promise<DatasetVersionSummaryInfo[]> {
  return datasetRepository.getDatasetVersionsSummaries(datasetId).catch((error) => {
    throw error
  })
}
