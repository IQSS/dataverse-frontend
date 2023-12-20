import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetPreview } from '../models/DatasetPreview'

export async function getDatasets(
  datasetRepository: DatasetRepository,
  paginationInfo: DatasetPaginationInfo
): Promise<DatasetPreview[]> {
  return datasetRepository.getAll(paginationInfo).catch((error: Error) => {
    throw new Error(error.message)
  })
}
