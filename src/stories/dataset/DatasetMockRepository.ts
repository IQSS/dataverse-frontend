import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset as DatasetModel } from '../../dataset/domain/models/Dataset'
import { DatasetMockData } from './DatasetMockData'

export class DatasetMockRepository implements DatasetRepository {
  getByPersistentId(persistentId: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMockData({ persistentId: persistentId }))
      }, 1000)
    })
  }
  // eslint-disable-next-line unused-imports/no-unused-vars
  getByPrivateUrlToken(privateUrlToken: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMockData({}, true))
      }, 1000)
    })
  }
}
