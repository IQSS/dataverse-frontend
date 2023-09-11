import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset as DatasetModel } from '../../dataset/domain/models/Dataset'
import { DatasetMockData } from './DatasetMockData'
import {
  DatasetMother,
  DatasetPermissionsMother,
  DatasetVersionMother
} from '../../../tests/component/dataset/domain/models/DatasetMother'

export class DatasetDraftWithAllPermissionsMockRepository implements DatasetRepository {
  getByPersistentId(persistentId: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          DatasetMother.create({
            permissions: DatasetPermissionsMother.createWithAllAllowed(),
            version: DatasetVersionMother.createDraftAsLatestVersion()
          })
        )
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
