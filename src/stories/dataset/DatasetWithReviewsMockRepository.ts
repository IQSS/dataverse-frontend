import { DatasetReview } from '@/dataset/domain/models/DatasetReview'
import { DatasetMockRepository } from './DatasetMockRepository'
import { datasetReviewsMock } from './DatasetReviewMockData'

export class DatasetWithReviewsMockRepository extends DatasetMockRepository {
  getDatasetReviews(_datasetId: string | number): Promise<DatasetReview[]> {
    return Promise.resolve(datasetReviewsMock)
  }
}
