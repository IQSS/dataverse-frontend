import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
import { DatasetVersionSummaryInfo } from '@/dataset/domain/models/DatasetVersionSummaryInfo'

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

  getDatasetVersionsSummaries(_datasetId: number | string): Promise<DatasetVersionSummaryInfo[]> {
    return new Promise(() => {})
  }
}
