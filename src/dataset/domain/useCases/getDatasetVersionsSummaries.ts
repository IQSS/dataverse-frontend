import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetVersionSummarySubset } from '../models/DatasetVersionSummaryInfo'

export function getDatasetVersionsSummaries(
  datasetRepository: DatasetRepository,
  datasetId: number | string,
  limit?: number,
  offset?: number
): Promise<DatasetVersionSummarySubset> {
  return datasetRepository.getDatasetVersionsSummaries(datasetId, limit, offset).catch((error) => {
    throw error
  })
}
