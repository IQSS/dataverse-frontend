import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../dataset/domain/models/DatasetPreview'
import { TotalDatasetsCount } from '../../dataset/domain/models/TotalDatasetsCount'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
export class NoDatasetsMockRepository extends DatasetMockRepository {
  getAll(_collectionId: string, _paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1000)
    })
  }

  getTotalDatasetsCount(_collectionId: string): Promise<TotalDatasetsCount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0)
      }, 1000)
    })
  }

  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount> = (
    _collectionId: string,
    _paginationInfo: DatasetPaginationInfo
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ datasetPreviews: [], totalCount: 0 })
      }, 1000)
    })
  }
}
