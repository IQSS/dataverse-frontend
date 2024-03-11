import { Dataset } from '../models/Dataset'
import { TotalDatasetsCount } from '../models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetPreview } from '../models/DatasetPreview'
import { DatasetFormFields } from '../models/DatasetFormFields'
import { DatasetsWithCount } from '../models/DatasetsWithCount'

export interface DatasetRepository {
  getByPersistentId: (persistentId: string, version?: string) => Promise<Dataset | undefined>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>
  getAll: (collectionId: string, paginationInfo: DatasetPaginationInfo) => Promise<DatasetPreview[]>
  getTotalDatasetsCount: (collectionId: string) => Promise<TotalDatasetsCount>
  getDatasetsWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount>
  // Created as placeholder for https://github.com/IQSS/dataverse-frontend/pull/251
  createDataset: (fields: DatasetFormFields) => Promise<string>
}
