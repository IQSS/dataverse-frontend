import { Dataset, DatasetLock } from '../models/Dataset'
import { DatasetVersionDiff } from '../models/DatasetVersionDiff'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetDTO } from '../useCases/DTOs/DatasetDTO'
import { DatasetsWithCount } from '../models/DatasetsWithCount'
import { VersionUpdateType } from '../models/VersionUpdateType'

export interface DatasetRepository {
  getByPersistentId: (persistentId: string, version?: string) => Promise<Dataset | undefined>
  getLocks(persistentId: string): Promise<DatasetLock[]>
  getByPrivateUrlToken: (privateUrlToken: string) => Promise<Dataset | undefined>
  getVersionDiff: (
    persistentId: string,
    oldVersion: string,
    newVersion: string
  ) => Promise<DatasetVersionDiff>

  create: (dataset: DatasetDTO, collectionId: string) => Promise<{ persistentId: string }>
  updateMetadata: (
    datasetId: string | number,
    datasetDTO: DatasetDTO,
    internalVersionNumber: number
  ) => Promise<void>
  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount>
  publish(persistentId: string, versionUpdateType: VersionUpdateType): Promise<void>
}
