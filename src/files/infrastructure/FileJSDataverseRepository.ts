import { FileRepository } from '../domain/repositories/FileRepository'
import { FileDownloadMode } from '../domain/models/FileMetadata'
import { FilesCountInfo } from '../domain/models/FilesCountInfo'

import {
  File as JSFile,
  FileDataTable as JSFileTabularData,
  FileDownloadSizeMode,
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
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { File } from '../domain/models/File'
import { FileMother } from '../../../tests/component/files/domain/models/FileMother'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'
import { BASE_URL } from '../../config'
import { FilePreview } from '../domain/models/FilePreview'
import { JSFilesCountInfoMapper } from './mappers/JSFilesCountInfoMapper'
import { FilePermissions } from '../domain/models/FilePermissions'
import { JSFilePermissionsMapper } from './mappers/JSFilePermissionsMapper'

const includeDeaccessioned = true

export class FileJSDataverseRepository implements FileRepository {
  static readonly DATAVERSE_BACKEND_URL = BASE_URL

  getAllByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo: FilePaginationInfo = new FilePaginationInfo(),
    criteria: FileCriteria = new FileCriteria()
  ): Promise<FilePreview[]> {
    return getDatasetFiles
      .execute(
        datasetPersistentId,
        datasetVersion.number.toString(),
        includeDeaccessioned,
        paginationInfo.pageSize,
        paginationInfo.offset,
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
      .then(([jsFiles, downloadCounts, thumbnails, permissions, jsTabularData]) =>
        jsFiles.map((jsFile, index) =>
          JSFileMapper.toFile(
            jsFile,
            datasetVersion,
            downloadCounts[index],
            permissions[index],
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
  private static getAllWithPermissions(files: JSFile[]): Promise<FilePermissions[]> {
    return Promise.all(files.map((jsFile) => this.getPermissionsById(jsFile.id)))
  }

  private static getPermissionsById(id: number): Promise<FilePermissions> {
    return getFileUserPermissions
      .execute(id)
      .then((jsFilePermissions) => JSFilePermissionsMapper.toFilePermissions(jsFilePermissions))
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
    datasetVersionNumber: DatasetVersionNumber,
    criteria: FileCriteria
  ): Promise<FilesCountInfo> {
    return getDatasetFileCounts
      .execute(
        datasetPersistentId,
        datasetVersionNumber.toString(),
        includeDeaccessioned,
        DomainFileMapper.toJSFileSearchCriteria(criteria)
      )
      .then((jsFilesCountInfo) => {
        return JSFilesCountInfoMapper.toFilesCountInfo(jsFilesCountInfo)
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getFilesTotalDownloadSizeByDatasetPersistentId(
    datasetPersistentId: string,
    datasetVersionNumber: DatasetVersionNumber,
    criteria: FileCriteria = new FileCriteria()
  ): Promise<number> {
    return getDatasetFilesTotalDownloadSize
      .execute(
        datasetPersistentId,
        datasetVersionNumber.toString(),
        FileDownloadSizeMode.ARCHIVAL,
        DomainFileMapper.toJSFileSearchCriteria(criteria),
        includeDeaccessioned
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  getById(id: number): Promise<File> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(FileMother.createRealistic())
      }, 1000)
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
