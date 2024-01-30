import { FilePreview, FileDownloadMode } from '../models/FilePreview'
import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { DatasetVersion, DatasetVersionNumber } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../models/FilePaginationInfo'

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
  getById: (id: number) => Promise<File | undefined>
  getMultipleFileDownloadUrl: (ids: number[], downloadMode: FileDownloadMode) => string
  getFileDownloadUrl: (id: number, downloadMode: FileDownloadMode) => string
}
