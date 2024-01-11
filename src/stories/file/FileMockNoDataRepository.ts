import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMockRepository } from './FileMockRepository'
import { File } from '../../files/domain/models/File'

export class FileMockNoDataRepository extends FileMockRepository implements FileRepository {
  getAllByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
  ): Promise<FilePreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([])
      }, 1000)
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersionNumber: DatasetVersionNumber
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.createEmpty())
      }, 1000)
    })
  }

  getFilesTotalDownloadSizeByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersionNumber: DatasetVersionNumber,
    // eslint-disable-next-line unused-imports/no-unused-vars
    criteria?: FileCriteria
  ): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(0)
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getById(id: number): Promise<File | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(undefined)
      }, 1000)
    })
  }
}
