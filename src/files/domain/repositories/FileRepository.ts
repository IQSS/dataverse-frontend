import { FileDownloadMode } from '../models/FileMetadata'
import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { DatasetVersion, DatasetVersionNumber } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../models/FilePaginationInfo'
import { FilePreview } from '../models/FilePreview'
import { FileHolder } from './File'

export interface FileRepository {
  getAllByDatasetPersistentId: (
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo?: FilePaginationInfo,
    criteria?: FileCriteria
  ) => Promise<FilePreview[]>
  getFilesCountInfoByDatasetPersistentId: (
    datasetPersistentId: string,
    datasetVersionNumber: DatasetVersionNumber,
    criteria: FileCriteria
  ) => Promise<FilesCountInfo>
  getFilesTotalDownloadSizeByDatasetPersistentId: (
    datasetPersistentId: string,
    datasetVersionNumber: DatasetVersionNumber,
    criteria?: FileCriteria
  ) => Promise<number>
  getById: (id: number, datasetVersionNumber?: string) => Promise<File | undefined>
  getMultipleFileDownloadUrl: (ids: number[], downloadMode: FileDownloadMode) => string
  getFileDownloadUrl: (id: number, downloadMode: FileDownloadMode) => string
  uploadFile: (
    datasetId: number | string,
    file: FileHolder,
    progress: (now: number) => void,
    abortController: AbortController,
    storageIdSetter: (storageId: string) => void
  ) => Promise<void>
  addUploadedFile: (
    datasetId: number | string,
    file: FileHolder,
    storageId: string
  ) => Promise<void>
}
