import { DatasetReviewSubmission } from '../models/DatasetCuration'
import { DatasetRepository } from '../repositories/DatasetRepository'

export async function submitDatasetForReview(
  datasetRepository: DatasetRepository,
  datasetId: string | number
): Promise<DatasetReviewSubmission> {
  return datasetRepository.submitForReview(datasetId)
}
