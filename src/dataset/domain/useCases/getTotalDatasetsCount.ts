import { DatasetRepository } from '../repositories/DatasetRepository'
import { TotalDatasetsCount } from '../models/TotalDatasetsCount'

export async function getTotalDatasetsCount(
  datasetRepository: DatasetRepository
): Promise<TotalDatasetsCount> {
  return datasetRepository.getTotalDatasetsCount().catch((error: Error) => {
    throw new Error(error.message)
  })
}
