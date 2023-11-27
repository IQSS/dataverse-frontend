import { FileRepository } from '../domain/repositories/FileRepository'
import { File, FilePublishingStatus } from '../domain/models/File'
import { FilesCountInfo } from '../domain/models/FilesCountInfo'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'
import { FileUserPermissions } from '../domain/models/FileUserPermissions'
import {
  FileDownloadSizeMode,
  getDatasetFileCounts,
  getDatasetFiles,
  getDatasetFilesTotalDownloadSize,
  getFileDownloadCount,
  getFileUserPermissions,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { FileCriteria } from '../domain/models/FileCriteria'
import { DomainFileMapper } from './mappers/DomainFileMapper'
import { JSFileMapper } from './mappers/JSFileMapper'
import { DatasetVersion } from '../../dataset/domain/models/Dataset'

const includeDeaccessioned = true

export class FileJSDataverseRepository implements FileRepository {
  static readonly DATAVERSE_BACKEND_URL =
    (import.meta.env.VITE_DATAVERSE_BACKEND_URL as string) ?? ''

  getAllByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo: FilePaginationInfo = new FilePaginationInfo(),
    criteria: FileCriteria = new FileCriteria()
  ): Promise<File[]> {
    const jsPagination = DomainFileMapper.toJSPagination(paginationInfo)

    return getDatasetFiles
      .execute(
        datasetPersistentId,
        datasetVersion.toString(),
        includeDeaccessioned,
        jsPagination.limit,
        jsPagination.offset,
        DomainFileMapper.toJSFileSearchCriteria(criteria),
        DomainFileMapper.toJSFileOrderCriteria(criteria.sortBy)
      )
      .then((jsFiles) => jsFiles.map((jsFile) => JSFileMapper.toFile(jsFile, datasetVersion)))
      .then((files) => FileJSDataverseRepository.getAllWithDownloadCount(files))
      .then((files) => FileJSDataverseRepository.getAllWithThumbnail(files))
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  private static getAllWithDownloadCount(files: File[]): Promise<File[]> {
    return Promise.all(
      files.map((file) =>
        FileJSDataverseRepository.getDownloadCountById(file.id, file.version.publishingStatus).then(
          (downloadCount) => {
            file.downloadCount = downloadCount
            return file
          }
        )
      )
    )
  }

  private static getDownloadCountById(
    id: number,
    publishingStatus: FilePublishingStatus
  ): Promise<number> {
    if (publishingStatus === FilePublishingStatus.RELEASED) {
      return getFileDownloadCount.execute(id).then((downloadCount) => Number(downloadCount))
    }
    return Promise.resolve(0)
  }

  private static getAllWithThumbnail(files: File[]): Promise<File[]> {
    return Promise.all(
      files.map((file) =>
        FileJSDataverseRepository.getThumbnailById(file.id).then((thumbnail) => {
          file.thumbnail = thumbnail
          return file
        })
      )
    )
  }

  private static getThumbnailById(id: number): Promise<string | undefined> {
    return fetch(`${this.DATAVERSE_BACKEND_URL}/api/access/datafile/${id}?imageThumb=400`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then((blob) => {
        return URL.createObjectURL(blob)
      })
      .catch(() => {
        return undefined
      })
  }

  getFilesCountInfoByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    criteria: FileCriteria
  ): Promise<FilesCountInfo> {
    return getDatasetFileCounts
      .execute(
        datasetPersistentId,
        datasetVersion.toString(),
        includeDeaccessioned,
        DomainFileMapper.toJSFileSearchCriteria(criteria)
      )
      .then((jsFilesCountInfo) => {
        return JSFileMapper.toFilesCountInfo(jsFilesCountInfo)
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getFilesTotalDownloadSizeByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    criteria: FileCriteria = new FileCriteria()
  ): Promise<number> {
    return getDatasetFilesTotalDownloadSize
      .execute(
        datasetPersistentId,
        datasetVersion.toString(),
        FileDownloadSizeMode.ARCHIVAL,
        DomainFileMapper.toJSFileSearchCriteria(criteria),
        includeDeaccessioned
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getUserPermissionsById(id: number): Promise<FileUserPermissions> {
    return getFileUserPermissions
      .execute(id)
      .then((jsFileUserPermissions) =>
        JSFileMapper.toFileUserPermissions(id, jsFileUserPermissions)
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getOriginalFileById(id: number): Promise<string | undefined> {
    return fetch(`${FileJSDataverseRepository.DATAVERSE_BACKEND_URL}/api/access/datafile/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.blob()
      })
      .then((blob) => {
        return URL.createObjectURL(blob)
      })
      .catch(() => {
        return undefined
      })
  }
}
