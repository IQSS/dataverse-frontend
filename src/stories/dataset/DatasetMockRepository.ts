import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'
import { TotalDatasetsCount } from '../../dataset/domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../dataset/domain/models/DatasetPreview'
import { DatasetPreviewMother } from '../../../tests/component/dataset/domain/models/DatasetPreviewMother'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
export class DatasetMockRepository implements DatasetRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAll(paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetPreviewMother.createManyRealistic(paginationInfo.pageSize))
      }, 1000)
    })
  }

  getTotalDatasetsCount(): Promise<TotalDatasetsCount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(200)
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

  create(dataset: DatasetDTO): Promise<string> {
    const returnMsg = 'Form Data Submitted: ' + JSON.stringify(dataset)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(returnMsg)
      }, 1000)
    })
  }
}
