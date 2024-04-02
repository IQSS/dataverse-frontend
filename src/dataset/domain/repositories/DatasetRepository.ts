import { Dataset } from '../models/Dataset'
import { TotalDatasetsCount } from '../models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetPreview } from '../models/DatasetPreview'
import { DatasetDTO } from '../useCases/DTOs/DatasetDTO'
import { DatasetsWithCount } from '../models/DatasetsWithCount'

export interface DatasetRepository {
  getByPersistentId: (persistentId: string, version?: string) => Promise<Dataset | undefined>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>
  getAll: (collectionId: string, paginationInfo: DatasetPaginationInfo) => Promise<DatasetPreview[]>
  getTotalDatasetsCount: (collectionId: string) => Promise<TotalDatasetsCount>
  create: (dataset: DatasetDTO) => Promise<{ persistentId: string }>
  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount>
}
