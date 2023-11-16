import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'

export class DatasetMockRepository implements DatasetRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAll(): Promise<Dataset[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createMany(200))
      }, 1000)
    })
  }

  getByPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    persistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    version?: string | undefined
  ): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, 1000)
    })
  }
  getByPrivateUrlToken(
    // eslint-disable-next-line unused-imports/no-unused-vars
    privateUrlToken: string
  ): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, 1000)
    })
  }
}
