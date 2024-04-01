import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../dataset/domain/models/DatasetPreview'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'

export class DatasetLoadingMockRepository extends DatasetMockRepository {
  getAll(_collectionId: string, _paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    return new Promise(() => {})
  }

  getDatasetsWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount> = (
    _collectionId: string,
    _paginationInfo: DatasetPaginationInfo
  ) => {
    return new Promise(() => {})
  }
}
