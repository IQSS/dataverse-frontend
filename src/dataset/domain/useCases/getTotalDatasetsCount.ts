import { DatasetRepository } from '../repositories/DatasetRepository'
import { TotalDatasetsCount } from '../models/TotalDatasetsCount'

export async function getTotalDatasetsCount(
  datasetRepository: DatasetRepository,
  collectionId: string
): Promise<TotalDatasetsCount> {
  return datasetRepository.getTotalDatasetsCount(collectionId).catch((error: Error) => {
    throw new Error(error.message)
  })
}
