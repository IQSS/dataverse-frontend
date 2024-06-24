import { Dataset, DatasetLock } from '../models/Dataset'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetDTO } from '../useCases/DTOs/DatasetDTO'
import { DatasetsWithCount } from '../models/DatasetsWithCount'
import { VersionUpdateType } from '../models/VersionUpdateType'

export interface DatasetRepository {
  getByPersistentId: (persistentId: string, version?: string) => Promise<Dataset | undefined>
  getLocks(persistentId: string): Promise<DatasetLock[]>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>
  create: (dataset: DatasetDTO, collectionId?: string) => Promise<{ persistentId: string }>
  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount>
  publish(persistentId: string, versionUpdateType: VersionUpdateType): Promise<void>
}
