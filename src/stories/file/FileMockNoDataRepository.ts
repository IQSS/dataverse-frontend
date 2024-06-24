import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'
import { File } from '../../files/domain/models/File'
import { FilesWithCount } from '../../files/domain/models/FilesWithCount'

export class FileMockNoDataRepository extends FileMockRepository implements FileRepository {
  getAllByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersion: DatasetVersion
  ): Promise<FilePreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1000)
    })
  }

  getAllByDatasetPersistentIdWithCount(
    _datasetPersistentId: string,
    _datasetVersion: DatasetVersion
  ): Promise<FilesWithCount> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          files: [],
          totalFilesCount: 0
        })
      }, 1000)
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersionNumber: DatasetVersionNumber
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.createEmpty())
      }, 1000)
    })
  }

  getFilesTotalDownloadSizeByDatasetPersistentId(
    _datasetPersistentId: string,
    _datasetVersionNumber: DatasetVersionNumber,
    _criteria?: FileCriteria
  ): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0)
      }, 1000)
    })
  }

  getById(_id: number): Promise<File | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }
}
