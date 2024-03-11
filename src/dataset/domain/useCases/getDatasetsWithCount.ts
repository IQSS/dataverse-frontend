import { DatasetRepository } from '../repositories/DatasetRepository'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetsWithCount } from '../models/DatasetsWithCount'

export async function getDatasetsWithCount(
  datasetRepository: DatasetRepository,
  collectionId: string,
  paginationInfo: DatasetPaginationInfo
): Promise<DatasetsWithCount> {
  return datasetRepository
    .getDatasetsWithCount(collectionId, paginationInfo)
    .catch((error: Error) => {
      throw new Error(error.message)
    })
}
