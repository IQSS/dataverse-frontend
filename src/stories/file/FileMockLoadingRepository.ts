import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'
import { File } from '../../files/domain/models/File'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'
import { FilesWithCount } from '../../files/domain/models/FilesWithCount'
import { RestrictDTO } from '@/files/domain/useCases/restrictFileDTO'

export class FileMockLoadingRepository extends FileMockRepository implements FileRepository {
  getAllByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersion: DatasetVersion
  ): Promise<FilePreview[]> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, 0)
    })
  }

  getAllByDatasetPersistentIdWithCount(
    _datasetPersistentId: string,
    _datasetVersion: DatasetVersion
  ): Promise<FilesWithCount> {
    return new Promise(() => {
      setTimeout(() => {}, 0)
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersionNumber: DatasetVersionNumber,
    _criteria?: FileCriteria
  ): Promise<FilesCountInfo> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, FakerHelper.loadingTimout())
    })
  }

  getById(_id: number): Promise<File> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, FakerHelper.loadingTimout())
    })
  }

  delete(_fileId: number | string): Promise<void> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, FakerHelper.loadingTimout())
    })
  }

  restrict(_fileId: number | string, _restrict: RestrictDTO): Promise<void> {
    return new Promise(() => {
      setTimeout(() => {
        // Do nothing
      }, FakerHelper.loadingTimout())
    })
  }
}
