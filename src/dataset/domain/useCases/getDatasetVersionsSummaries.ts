import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetVersionSummarySubset } from '../models/DatasetVersionSummaryInfo'
import { DatasetVersionPaginationInfo } from '../models/DatasetVersionPaginationInfo'

export function getDatasetVersionsSummaries(
  datasetRepository: DatasetRepository,
  datasetId: number | string,
  paginationInfo?: DatasetVersionPaginationInfo
): Promise<DatasetVersionSummarySubset> {
  return datasetRepository.getDatasetVersionsSummaries(datasetId, paginationInfo)
}
