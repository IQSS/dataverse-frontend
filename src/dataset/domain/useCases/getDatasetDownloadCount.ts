import { DatasetDownloadCount } from '../models/DatasetDownloadCount'
import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getDatasetDownloadCount(
  datasetRepository: DatasetRepository,
  datasetId: string | number,
  includeMDC?: boolean
): Promise<DatasetDownloadCount> {
  return datasetRepository.getDownloadCount(datasetId, includeMDC)
}
