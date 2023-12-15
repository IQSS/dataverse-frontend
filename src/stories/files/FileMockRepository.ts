import { FileRepository } from '../../files/domain/repositories/FileRepository'
import { FilesMockData } from './FileMockData'
import { FilePreview, FileDownloadMode } from '../../files/domain/models/FilePreview'
import { FilesCountInfo } from '../../files/domain/models/FilesCountInfo'
import { FilesCountInfoMother } from '../../../tests/component/files/domain/models/FilesCountInfoMother'
import { FilePaginationInfo } from '../../files/domain/models/FilePaginationInfo'
import { FileUserPermissionsMother } from '../../../tests/component/files/domain/models/FileUserPermissionsMother'
import { FileUserPermissions } from '../../files/domain/models/FileUserPermissions'
import { DatasetVersion } from '../../dataset/domain/models/Dataset'
import { FileCriteria } from '../../files/domain/models/FileCriteria'
import { FilePreviewMother } from '../../../tests/component/files/domain/models/FilePreviewMother'
import { FileMother } from '../../../tests/component/files/domain/models/FileMother'
import { File } from '../../files/domain/models/File'

export class FileMockRepository implements FileRepository {
  // eslint-disable-next-line unused-imports/no-unused-vars
  getAllByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo?: FilePaginationInfo
  ): Promise<FilePreview[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesMockData(paginationInfo))
      }, 1000)
    })
  }

  getFilesCountInfoByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion
  ): Promise<FilesCountInfo> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FilesCountInfoMother.create({ total: 200 }))
      }, 1000)
    })
  }

  getFilesTotalDownloadSizeByDatasetPersistentId(
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetPersistentId: string,
    // eslint-disable-next-line unused-imports/no-unused-vars
    datasetVersion: DatasetVersion,
    // eslint-disable-next-line unused-imports/no-unused-vars
    criteria?: FileCriteria
  ): Promise<number> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(19900)
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getUserPermissionsById(id: number): Promise<FileUserPermissions> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileUserPermissionsMother.create())
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getById(id: number): Promise<File | undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileMother.createRealistic())
      }, 1000)
    })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getMultipleFileDownloadUrl(ids: number[], downloadMode: FileDownloadMode): string {
    return FilePreviewMother.createDownloadUrl()
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getFileDownloadUrl(id: number, downloadMode: FileDownloadMode): string {
    return FilePreviewMother.createDownloadUrl()
  }
}
