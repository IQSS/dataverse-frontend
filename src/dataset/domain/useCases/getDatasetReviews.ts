import { DatasetReview } from '../models/DatasetReview'
import { DatasetRepository } from '../repositories/DatasetRepository'

export async function getDatasetReviews(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<DatasetReview[]> {
  return datasetRepository.getDatasetReviews(datasetId)
}
