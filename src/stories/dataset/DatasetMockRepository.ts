import { Dataset, DatasetLock } from '../../dataset/domain/models/Dataset'
import { DatasetRepository } from '../../dataset/domain/repositories/DatasetRepository'
import { DatasetMother } from '../../../tests/component/dataset/domain/models/DatasetMother'
import { DatasetPaginationInfo } from '../../dataset/domain/models/DatasetPaginationInfo'
import { DatasetPreviewMother } from '../../../tests/component/dataset/domain/models/DatasetPreviewMother'
import { DatasetDTO } from '../../dataset/domain/useCases/DTOs/DatasetDTO'
import { DatasetsWithCount } from '../../dataset/domain/models/DatasetsWithCount'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { VersionUpdateType } from '../../dataset/domain/models/VersionUpdateType'
export class DatasetMockRepository implements DatasetRepository {
  getAllWithCount: (
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
      }, FakerHelper.loadingTimout())
    })
  }

  getByPersistentId(
    _persistentId: string,
    _version?: string | undefined
  ): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }
  getByPrivateUrlToken(_privateUrlToken: string): Promise<Dataset | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DatasetMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }

  create(_dataset: DatasetDTO): Promise<{ persistentId: string }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ persistentId: 'some-persistent-id' })
      }, FakerHelper.loadingTimout())
    })
  }
  publish(persistentId: string, versionUpdateType: VersionUpdateType): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve()
      }, FakerHelper.loadingTimout())
    })
  }
  getLocks(persistentId: string): Promise<DatasetLock[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, FakerHelper.loadingTimout())
    })
  }
}
