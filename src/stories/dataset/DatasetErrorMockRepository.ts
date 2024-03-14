import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetMockRepository } from './DatasetMockRepository'
import { TotalDatasetsCount } from '../../dataset/domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../dataset/domain/models/DatasetPreview'
import { DatasetFormFields } from '../../dataset/domain/models/DatasetFormFields'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'

export class DatasetErrorMockRepository implements DatasetMockRepository {
  getAll(_collectionId: string, _paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }

  getTotalDatasetsCount(_collectionId: string): Promise<TotalDatasetsCount> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }

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

  createDataset(_fields: DatasetFormFields): Promise<string> {
    return new Promise((_resolve, reject) => {
      setTimeout(() => {
        reject('Error thrown from mock')
      }, 1000)
    })
  }
}
