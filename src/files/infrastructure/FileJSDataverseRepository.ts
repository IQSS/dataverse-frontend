import { FileRepository } from '../domain/repositories/FileRepository'
import { File } from '../domain/models/File'
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
  ReadError,
  File as JSFile
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
      .then((jsFiles) =>
        Promise.all([
          jsFiles,
          FileJSDataverseRepository.getAllDownloadCount(jsFiles),
          FileJSDataverseRepository.getAllThumbnails(jsFiles)
        ])
      )
      .then(([jsFiles, downloadCounts, thumbnails]) =>
        jsFiles.map((jsFile, index) =>
          JSFileMapper.toFile(jsFile, datasetVersion, downloadCounts[index], thumbnails[index])
        )
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  private static getAllDownloadCount(jsFiles: JSFile[]): Promise<number[]> {
    return Promise.all(
      jsFiles.map((jsFile) =>
        getFileDownloadCount.execute(jsFile.id).then((downloadCount) => Number(downloadCount))
      )
    )
  }

  private static getAllThumbnails(jsFiles: JSFile[]): Promise<(string | undefined)[]> {
    return Promise.all(jsFiles.map((jsFile) => this.getThumbnailById(jsFile.id)))
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
}
