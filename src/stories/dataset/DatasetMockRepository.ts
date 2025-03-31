import { Dataset, DatasetLock } from '../../dataset/domain/models/Dataset'
import { DatasetVersionDiff } from '../../dataset/domain/models/DatasetVersionDiff'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetItemTypePreviewMother } from '../../../tests/component/dataset/domain/models/DatasetItemTypePreviewMother'
import { DatasetVersionDiffMother } from '../../../tests/component/dataset/domain/models/DatasetVersionDiffMother'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { VersionUpdateType } from '../../dataset/domain/models/VersionUpdateType'
import { DatasetDeaccessionDTO } from '@iqss/dataverse-client-javascript'
export class DatasetMockRepository implements DatasetRepository {
  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount> = (
    _collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          datasetPreviews: DatasetItemTypePreviewMother.createManyRealistic(
            paginationInfo.pageSize
          ),
          totalCount: 200
        })
      }, FakerHelper.loadingTimout())
    })
  }

  getByPersistentId(
    _persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }
  getByPrivateUrlToken(_privateUrlToken: string): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }
  getVersionDiff(
    _persistentId: string,
    _oldVersion: string,
    _newVersion: string
  ): Promise<DatasetVersionDiff> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetVersionDiffMother.create())
      }, FakerHelper.loadingTimout())
    })
  }
  create(_dataset: DatasetDTO): Promise<{ persistentId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ persistentId: 'some-persistent-id' })
      }, FakerHelper.loadingTimout())
    })
  }
  publish(_persistentId: string, _versionUpdateType: VersionUpdateType): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
  getLocks(_persistentId: string): Promise<DatasetLock[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, FakerHelper.loadingTimout())
    })
  }

  updateMetadata(_datasetId: string | number, _updatedDataset: DatasetDTO): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
  deaccession(
    _datasetId: string | number,
    _version: string,
    _datasetDeaccessionDTO: DatasetDeaccessionDTO
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
}
