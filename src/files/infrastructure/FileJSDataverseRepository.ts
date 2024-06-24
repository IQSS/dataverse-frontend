import { FileRepository } from '../domain/repositories/FileRepository'
import { FileDownloadMode, FileTabularData } from '../domain/models/FileMetadata'
import { FilesCountInfo } from '../domain/models/FilesCountInfo'

import {
  File as JSFile,
  FileDownloadSizeMode,
  getDatasetCitation,
  getDatasetFileCounts,
  getDatasetFiles,
  getDatasetFilesTotalDownloadSize,
  getFileAndDataset,
  getFileCitation,
  getFileDataTables,
  getFileDownloadCount,
  getFileUserPermissions,
  //uploadFile as jsUploadFile,
  //addUploadedFileToDataset,
  ReadError
} from '@iqss/dataverse-client-javascript'
import { FileCriteria } from '../domain/models/FileCriteria'
import { DomainFileMapper } from './mappers/DomainFileMapper'
import { JSFileMapper } from './mappers/JSFileMapper'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { File } from '../domain/models/File'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'
import { BASE_URL } from '../../config'
import { FilePreview } from '../domain/models/FilePreview'
import { JSFilesCountInfoMapper } from './mappers/JSFilesCountInfoMapper'
import { JSFileMetadataMapper } from './mappers/JSFileMetadataMapper'
import { FilePermissions } from '../domain/models/FilePermissions'
import { JSFilePermissionsMapper } from './mappers/JSFilePermissionsMapper'
import { FilesWithCount } from '../domain/models/FilesWithCount'
import { FileHolder } from '../domain/repositories/File'
import { FileUploadState } from '../domain/models/FileUploadState'

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
      .then((jsFilesSubset) =>
        Promise.all([
          jsFilesSubset.files,
          FileJSDataverseRepository.getAllDownloadCount(jsFilesSubset.files),
          FileJSDataverseRepository.getAllThumbnails(jsFilesSubset.files),
          FileJSDataverseRepository.getAllWithPermissions(jsFilesSubset.files),
          FileJSDataverseRepository.getAllTabularData(jsFilesSubset.files)
        ])
      )
      .then(([jsFiles, downloadCounts, thumbnails, permissions, tabularData]) =>
        jsFiles.map((jsFile, index) =>
          JSFileMapper.toFilePreview(
            jsFile,
            datasetVersion,
            downloadCounts[index],
            permissions[index],
            thumbnails[index],
            tabularData[index]
          )
        )
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  getAllByDatasetPersistentIdWithCount(
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo: FilePaginationInfo = new FilePaginationInfo(),
    criteria: FileCriteria = new FileCriteria()
  ): Promise<FilesWithCount> {
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
      .then((jsFilesSubset) =>
        Promise.all([
          jsFilesSubset.files,
          jsFilesSubset.totalFilesCount,
          FileJSDataverseRepository.getAllDownloadCount(jsFilesSubset.files),
          FileJSDataverseRepository.getAllThumbnails(jsFilesSubset.files),
          FileJSDataverseRepository.getAllWithPermissions(jsFilesSubset.files),
          FileJSDataverseRepository.getAllTabularData(jsFilesSubset.files)
        ])
      )
      .then(([jsFiles, totalFilesCount, downloadCounts, thumbnails, permissions, tabularData]) => {
        const mappedFiles = jsFiles.map((jsFile, index) =>
          JSFileMapper.toFilePreview(
            jsFile,
            datasetVersion,
            downloadCounts[index],
            permissions[index],
            thumbnails[index],
            tabularData[index]
          )
        )
        return { files: mappedFiles, totalFilesCount }
      })
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  private static getAllTabularData(jsFiles: JSFile[]): Promise<(FileTabularData | undefined)[]> {
    return Promise.all(
      jsFiles.map((jsFile) =>
        FileJSDataverseRepository.getTabularDataById(jsFile.id, jsFile.tabularData)
      )
    )
  }

  private static getTabularDataById(
    id: number,
    isTabular: boolean
  ): Promise<FileTabularData> | undefined {
    return isTabular
      ? getFileDataTables
          .execute(id)
          .then((jsTabularData) => JSFileMetadataMapper.toFileTabularData(jsTabularData))
      : undefined
  }

  private static getAllDownloadCount(jsFiles: JSFile[]): Promise<number[]> {
    return Promise.all(
      jsFiles.map((jsFile) =>
        FileJSDataverseRepository.getDownloadCountById(jsFile.id, jsFile.publicationDate)
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

  private static getDownloadCountById(id: number, publicationDate?: Date): Promise<number> {
    return publicationDate !== undefined
      ? getFileDownloadCount.execute(id).then((downloadCount) => Number(downloadCount))
      : Promise.resolve(0)
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

  getById(id: number, datasetVersionNumber?: string): Promise<File> {
    return getFileAndDataset
      .execute(id, datasetVersionNumber)
      .then(([jsFile, jsDataset]) =>
        Promise.all([
          jsFile,
          jsDataset,
          getDatasetCitation.execute(jsDataset.id, datasetVersionNumber, includeDeaccessioned),
          FileJSDataverseRepository.getCitationById(jsFile.id),
          FileJSDataverseRepository.getDownloadCountById(jsFile.id, jsFile.publicationDate),
          FileJSDataverseRepository.getPermissionsById(jsFile.id),
          FileJSDataverseRepository.getThumbnailById(jsFile.id),
          FileJSDataverseRepository.getTabularDataById(jsFile.id, jsFile.tabularData)
        ])
      )
      .then(
        ([
          jsFile,
          jsDataset,
          datasetCitation,
          citation,
          downloadsCount,
          permissions,
          thumbnail,
          tabularData
        ]) =>
          JSFileMapper.toFile(
            jsFile,
            jsDataset,
            datasetCitation,
            citation,
            downloadsCount,
            permissions,
            thumbnail,
            tabularData
          )
      )
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  private static getCitationById(id: number): Promise<string> {
    return getFileCitation
      .execute(id, undefined, includeDeaccessioned)
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

  uploadFile(
    datasetId: number | string,
    file: FileHolder,
    progress: (now: number) => void,
    abortController: AbortController,
    storageIdSetter: (storageId: string) => void
  ): Promise<void> {
    /*return jsUploadFile
      .execute(datasetId, file.file, progress, abortController)
      .then(storageIdSetter)
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })*/
    return new Promise(() => {})
  }

  addUploadedFile(datasetId: number | string, files: FileUploadState[]): Promise<void[]> {
    const all: Promise<void>[] = []
    files.forEach((file) => {
      const f: FileHolder = {
        file: {
          lastModified: file.fileLastModified,
          name: file.fileName,
          webkitRelativePath: file.fileDir ? file.fileDir + '/' + file.fileName : file.fileName,
          size: file.fileSize,
          type: file.fileType,
          arrayBuffer: function (): Promise<ArrayBuffer> {
            throw new Error('Function not implemented.')
          },
          slice: function (
            _start?: number | undefined,
            _end?: number | undefined,
            _contentType?: string | undefined
          ): Blob {
            throw new Error('Function not implemented.')
          },
          stream: function (): ReadableStream<Uint8Array> {
            throw new Error('Function not implemented.')
          },
          text: function (): Promise<string> {
            throw new Error('Function not implemented.')
          }
        }
      }
      console.log(f.file.name)
      all.push(new Promise(() => {}))
      //all.push(addUploadedFileToDataset.execute(datasetId, f.file, file.storageId as string))
    })
    return Promise.all(all)
  }
}
