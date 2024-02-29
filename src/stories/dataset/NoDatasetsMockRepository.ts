import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../dataset/domain/models/DatasetPreview'
import { TotalDatasetsCount } from '../../dataset/domain/models/TotalDatasetsCount'
export class NoDatasetsMockRepository extends DatasetMockRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAll(collectionId: string, paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1000)
    })
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  getTotalDatasetsCount(collectionId: string): Promise<TotalDatasetsCount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0)
      }, 1000)
    })
  }
}
