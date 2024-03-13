import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilesMockData } from './FileMockData'
import { FileDownloadMode } from '../../files/domain/models/FileMetadata'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FileMetadataMother } from '../../../tests/component/files/domain/models/FileMetadataMother'
import { FilePaginationInfo } from '../../files/domain/models/FilePaginationInfo'
import { FileMother } from '../../../tests/component/files/domain/models/FileMother'
import { File } from '../../files/domain/models/File'
import { FilePreview } from '../../files/domain/models/FilePreview'
import { FakerHelper } from '../../../tests/component/shared/FakerHelper'

export class FileMockRepository implements FileRepository {
  constructor(public readonly fileMock?: File) {}

  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo?: FilePaginationInfo
  ): Promise<FilePreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData(paginationInfo))
      }, FakerHelper.loadingTimout())
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
        resolve(FilesCountInfoMother.create({ total: 200 }))
      }, FakerHelper.loadingTimout())
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
        resolve(19900)
      }, FakerHelper.loadingTimout())
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars

  // eslint-disable-next-line unused-imports/no-unused-vars
  getById(id: number): Promise<File | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.fileMock ?? FileMother.createRealistic())
      }, FakerHelper.loadingTimout())
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getMultipleFileDownloadUrl(ids: number[], downloadMode: FileDownloadMode): string {
    return FileMetadataMother.createDownloadUrl()
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getFileDownloadUrl(id: number, downloadMode: FileDownloadMode): string {
    return FileMetadataMother.createDownloadUrl()
  }
}
