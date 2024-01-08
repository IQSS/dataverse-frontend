import { FileRepository } from '../domain/repositories/FileRepository'
import { FilesCountInfo } from '../domain/models/FilesCountInfo'
import { FileUserPermissions } from '../domain/models/FileUserPermissions'
import { File, FileDownloadMode } from '../domain/models/File'
import {
  File as JSFile,
  FileDataTable as JSFileTabularData,
  FileDownloadSizeMode,
  FileUserPermissions as JSFileUserPermissions,
  getDatasetFileCounts,
  getDatasetFiles,
  getDatasetFilesTotalDownloadSize,
  getFileDataTables,
  getFileDownloadCount,
  getFileUserPermissions,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { FileCriteria } from '../domain/models/FileCriteria'
import { DomainFileMapper } from './mappers/DomainFileMapper'
import { JSFileMapper } from './mappers/JSFileMapper'
import { DatasetVersion } from '../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'

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
          FileJSDataverseRepository.getAllThumbnails(jsFiles),
          FileJSDataverseRepository.getAllWithPermissions(jsFiles),
          FileJSDataverseRepository.getAllTabularData(jsFiles)
        ])
      )
      .then(([jsFiles, downloadCounts, thumbnails, jsFileUserPermissions, jsTabularData]) =>
        jsFiles.map((jsFile, index) =>
          JSFileMapper.toFile(
            jsFile,
            datasetVersion,
            downloadCounts[index],
            jsFileUserPermissions[index],
            thumbnails[index],
            jsTabularData[index]
          )
        )
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  private static getAllTabularData(
    jsFiles: JSFile[]
  ): Promise<(JSFileTabularData[] | undefined)[]> {
    return Promise.all(
      jsFiles.map((jsFile) =>
        jsFile.tabularData ? getFileDataTables.execute(jsFile.id) : undefined
      )
    )
  }

  private static getAllDownloadCount(jsFiles: JSFile[]): Promise<number[]> {
    return Promise.all(
      jsFiles.map((jsFile) =>
        jsFile.publicationDate
          ? getFileDownloadCount.execute(jsFile.id).then((downloadCount) => Number(downloadCount))
          : 0
      )
    )
  }

  private static getAllThumbnails(jsFiles: JSFile[]): Promise<(string | undefined)[]> {
    return Promise.all(jsFiles.map((jsFile) => this.getThumbnailById(jsFile.id)))
  }
  private static getAllWithPermissions(files: JSFile[]): Promise<JSFileUserPermissions[]> {
    return Promise.all(files.map((jsFile) => this.getFileUserPermissionById(jsFile.id)))
  }

  private static getFileUserPermissionById(id: number): Promise<JSFileUserPermissions> {
    return getFileUserPermissions.execute(id).then((jsFileUserPermissions) => {
      return jsFileUserPermissions
    })
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

  getMultipleFileDownloadUrl(ids: number[], downloadMode: FileDownloadMode): string {
    return `/api/access/datafiles/${ids.join(',')}?format=${downloadMode}`
  }

  getFileDownloadUrl(id: number, downloadMode: FileDownloadMode): string {
    if (downloadMode === FileDownloadMode.ORIGINAL) {
      return `/api/access/datafile/${id}?format=${downloadMode}`
    }
    return `/api/access/datafile/${id}`
  }
}
