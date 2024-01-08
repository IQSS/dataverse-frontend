import { Dataset } from '../models/Dataset'
import { TotalDatasetsCount } from '../models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetPreview } from '../models/DatasetPreview'

export interface DatasetRepository {
  getByPersistentId: (persistentId: string, version?: string) => Promise<Dataset | undefined>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>
  getAll: (paginationInfo: DatasetPaginationInfo) => Promise<DatasetPreview[]>
  getTotalDatasetsCount: () => Promise<TotalDatasetsCount>
  // Created as placeholder for https://github.com/IQSS/dataverse-frontend/pull/251
  // addNewDataset: (formData: any) => Promise<Dataset | undefined>
}
