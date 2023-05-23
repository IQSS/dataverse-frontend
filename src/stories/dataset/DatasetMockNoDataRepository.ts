import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset as DatasetModel } from '../../dataset/domain/models/Dataset'

export class DatasetMockNoDataRepository implements DatasetRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getByPersistentId(persistentId: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getByPrivateUrlToken(privateUrlToken: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }
}
