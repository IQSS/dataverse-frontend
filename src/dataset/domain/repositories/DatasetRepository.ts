import { Dataset, DatasetLock } from '../models/Dataset'
import { DatasetVersionDiff } from '../models/DatasetVersionDiff'
import { DatasetPaginationInfo } from '../models/DatasetPaginationInfo'
import { DatasetDTO } from '../useCases/DTOs/DatasetDTO'
import { DatasetsWithCount } from '../models/DatasetsWithCount'
import { VersionUpdateType } from '../models/VersionUpdateType'
import { DatasetDeaccessionDTO } from '../useCases/DTOs/DatasetDTO'

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
  updateMetadata: (datasetId: string | number, datasetDTO: DatasetDTO) => Promise<void>
  deaccession: (
    datasetId: string | number,
    version: string,
    deaccessionDTO: DatasetDeaccessionDTO
  ) => Promise<void>

  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount>
  publish(persistentId: string, versionUpdateType: VersionUpdateType): Promise<void>
}
