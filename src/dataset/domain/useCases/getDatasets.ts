import { DatasetRepository } from '../repositories/DatasetRepository'
import { Dataset } from '../models/Dataset'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'

export async function getDatasets(
  datasetRepository: DatasetRepository,
  paginationInfo: DatasetPaginationInfo
): Promise<Dataset[]> {
  return datasetRepository.getAll(paginationInfo).catch((error: Error) => {
    throw new Error(error.message)
  })
}
