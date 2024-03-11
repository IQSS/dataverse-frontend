import { Dataset } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'
import { TotalDatasetsCount } from '../../dataset/domain/models/TotalDatasetsCount'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreview } from '../../dataset/domain/models/DatasetPreview'
import { DatasetPreviewMother } from '../../../tests/component/dataset/domain/models/DatasetPreviewMother'
import { DatasetFormFields } from '../../dataset/domain/models/DatasetFormFields'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
export class DatasetMockRepository implements DatasetRepository {
  getAll(_collectionId: string, paginationInfo: DatasetPaginationInfo): Promise<DatasetPreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetPreviewMother.createManyRealistic(paginationInfo.pageSize))
      }, 1000)
    })
  }

  getTotalDatasetsCount(_collectionId: string): Promise<TotalDatasetsCount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(200)
      }, 1000)
    })
  }

  getDatasetsWithCount: (
    collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => Promise<DatasetsWithCount> = (
    _collectionId: string,
    paginationInfo: DatasetPaginationInfo
  ) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          datasetPreviews: DatasetPreviewMother.createManyRealistic(paginationInfo.pageSize),
          totalCount: 200
        })
      }, 1000)
    })
  }

  getByPersistentId(
    _persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, 1000)
    })
  }
  getByPrivateUrlToken(_privateUrlToken: string): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, 1000)
    })
  }

  createDataset(fields: DatasetFormFields): Promise<string> {
    const returnMsg = 'Form Data Submitted: ' + JSON.stringify(fields)
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(returnMsg)
      }, 1000)
    })
  }
}
