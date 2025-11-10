import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
import { DatasetVersionSummarySubset } from '@/dataset/domain/models/DatasetVersionSummaryInfo'
import { DatasetVersionPaginationInfo } from '@/dataset/domain/models/DatasetVersionPaginationInfo'

export class DatasetLoadingMockRepository extends DatasetMockRepository {
  getDatasetsWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount> = (
    _collectionId: string,
    _paginationInfo: DatasetPaginationInfo
  ) => {
    return new Promise(() => {})
  }

  getDatasetVersionsSummaries(
    _datasetId: number | string,
    _paginationInfo?: DatasetVersionPaginationInfo
  ): Promise<DatasetVersionSummarySubset> {
    return new Promise(() => {})
  }
}
