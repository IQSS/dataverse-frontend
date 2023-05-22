import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { Dataset as DatasetModel, MetadataBlockName } from '../../dataset/domain/models/Dataset'
import { DatasetMockData } from './DatasetMockData'

export class DatasetMockRepository implements DatasetRepository {
  getById(id: string): Promise<DatasetModel | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMockData({ id: id }))
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
