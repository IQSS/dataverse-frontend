import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset as DatasetModel } from '../../dataset/domain/models/Dataset'
import { DatasetMockDataDraftVersion } from './DatasetMockDataDraftVersion'

export class DatasetMockDraftVersionRepository implements DatasetRepository {
  getByPersistentId(persistentId: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMockDataDraftVersion({ persistentId: persistentId }))
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getByPrivateUrlToken(privateUrlToken: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMockDataDraftVersion({}, true))
      }, 1000)
    })
  }
}
