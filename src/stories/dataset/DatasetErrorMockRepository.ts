import { Dataset, DatasetLock } from '../../dataset/domain/models/Dataset'
import { DatasetMockRepository } from './DatasetMockRepository'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { VersionUpdateType } from '../../dataset/domain/models/VersionUpdateType'

export class DatasetErrorMockRepository implements DatasetMockRepository {
  getAllWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount> = (
    _collectionId: string,
    _paginationInfo: DatasetPaginationInfo
  ) => {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }

  getByPersistentId(
    _persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }
  getByPrivateUrlToken(_privateUrlToken: string): Promise<Dataset | undefined> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }

  create(_dataset: DatasetDTO): Promise<{ persistentId: string }> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, FakerHelper.loadingTimout())
    })
  }
  publish(_persistentId: string, _versionUpdateType: VersionUpdateType): Promise<void> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, FakerHelper.loadingTimout())
    })
  }
  getLocks(_persistentId: string): Promise<DatasetLock[]> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, FakerHelper.loadingTimout())
    })
  }
}
