import { AxiosResponse } from 'axios'
import { axiosInstance } from '@/axiosInstance'
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
  uploadFile as jsUploadFile,
  addUploadedFilesToDataset,
  UploadedFileDTO,
  ReadError,
  deleteFile,
  replaceFile,
  restrictFile,
  updateFileMetadata
} from '@iqss/dataverse-client-javascript'
import { FileCriteria } from '../domain/models/FileCriteria'
import { DomainFileMapper } from './mappers/DomainFileMapper'
import { JSFileMapper } from './mappers/JSFileMapper'
import { DatasetVersion, DatasetVersionNumber } from '../../dataset/domain/models/Dataset'
import { File } from '../domain/models/File'
import { FilePaginationInfo } from '../domain/models/FilePaginationInfo'
import { DATAVERSE_BACKEND_URL } from '../../config'
import { FilePreview } from '../domain/models/FilePreview'
import { JSFilesCountInfoMapper } from './mappers/JSFilesCountInfoMapper'
import { JSFileMetadataMapper } from './mappers/JSFileMetadataMapper'
import { FilePermissions } from '../domain/models/FilePermissions'
import { JSFilePermissionsMapper } from './mappers/JSFilePermissionsMapper'
import { FilesWithCount } from '../domain/models/FilesWithCount'
import { FileHolder } from '../domain/models/FileHolder'
import { FixityAlgorithm } from '../domain/models/FixityAlgorithm'
import { RestrictFileDTO } from '../domain/useCases/restrictFileDTO'
import { FileMetadataDTO } from '@/files/domain/useCases/DTOs/FileMetadataDTO'

const includeDeaccessioned = true

export class FileJSDataverseRepository implements FileRepository {
  static readonly DATAVERSE_BACKEND_URL = DATAVERSE_BACKEND_URL

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

  private static getDownloadCountById(id: number, publicationDate?: string): Promise<number> {
    return publicationDate !== undefined
      ? getFileDownloadCount.execute(id).then((downloadCount) => Number(downloadCount))
      : Promise.resolve(0)
  }

  private static getAllThumbnails(jsFiles: JSFile[]): Promise<(string | undefined)[]> {
    return Promise.all(jsFiles.map((jsFile) => this.getThumbnailById(jsFile.id)))
  }

  private static getThumbnailById(id: number): Promise<string | undefined> {
    return axiosInstance
      .get(`${this.DATAVERSE_BACKEND_URL}/api/access/datafile/${id}?imageThumb=400`, {
        responseType: 'blob'
      })
      .then((res: AxiosResponse<Blob>) => {
        const blob = res.data

        const objectURL = URL.createObjectURL(blob)

        return objectURL
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
          FileJSDataverseRepository.getCitationById(jsFile.id, datasetVersionNumber),
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

  private static getCitationById(id: number, datasetVersionNumber?: string): Promise<string> {
    return getFileCitation
      .execute(id, datasetVersionNumber, includeDeaccessioned)
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
    return jsUploadFile
      .execute(datasetId, file.file, progress, abortController)
      .then(storageIdSetter)
      .catch((error: ReadError) => {
        throw new Error(error.message)
      })
  }

  addUploadedFiles(datasetId: number | string, uploadedFiles: UploadedFileDTO[]): Promise<void> {
    return addUploadedFilesToDataset.execute(datasetId, uploadedFiles)
  }

  delete(fileId: number | string): Promise<void> {
    return deleteFile.execute(fileId)
  }

  replace(fileId: number | string, uploadedFileDTO: UploadedFileDTO): Promise<number> {
    return replaceFile
      .execute(fileId, uploadedFileDTO)
      .then((newFileIdentifier) => newFileIdentifier)
  }

  updateMetadata(fileId: number | string, fileMetadata: FileMetadataDTO): Promise<void> {
    return updateFileMetadata.execute(fileId, fileMetadata)
  }
  // TODO - Not a priority but could be nice to implement this use case in js-dataverse when having time
  getFixityAlgorithm(): Promise<FixityAlgorithm> {
    return fetch(`${DATAVERSE_BACKEND_URL}/api/files/fixityAlgorithm`)
      .then((response) => {
        if (!response.ok) {
          console.log('Did not get fixityAlgorithm from Dataverse, using MD5')
          return { data: { message: FixityAlgorithm.MD5 } }
        }
        return response.json()
      })
      .then((checksumAlgJson: { data: { message: FixityAlgorithm } }) => {
        return checksumAlgJson?.data?.message ?? FixityAlgorithm.MD5
      })
      .catch((error) => {
        console.log('Error fetching fixityAlgorithm, using MD5', error)
        return FixityAlgorithm.MD5
      })
  }

  restrict(fileId: number | string, restrictFileDTO: RestrictFileDTO): Promise<void> {
    return restrictFile.execute(fileId, restrictFileDTO)
  }
}
