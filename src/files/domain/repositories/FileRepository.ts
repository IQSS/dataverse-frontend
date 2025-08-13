import { FileDownloadMode } from '../models/FileMetadata'
import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { DatasetVersion, DatasetVersionNumber } from '../../../dataset/domain/models/Dataset'
import { FilePaginationInfo } from '../models/FilePaginationInfo'
import { FilePreview } from '../models/FilePreview'
import { FilesWithCount } from '../models/FilesWithCount'
import { FileHolder } from '../models/FileHolder'
import { UploadedFileDTO } from '@iqss/dataverse-client-javascript'
import { FixityAlgorithm } from '../models/FixityAlgorithm'
import { FileMetadataDTO } from '@/files/domain/useCases/DTOs/FileMetadataDTO'
import { RestrictFileDTO } from '../useCases/restrictFileDTO'
import { FileVersionSummaryInfo } from '../models/FileVersionSummaryInfo'

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
    criteria: FileCriteria,
    includeDeaccessioned?: boolean
  ) => Promise<FilesCountInfo>
  getFilesTotalDownloadSizeByDatasetPersistentId: (
    datasetPersistentId: string,
    datasetVersionNumber: DatasetVersionNumber,
    criteria?: FileCriteria,
    includeDeaccessioned?: boolean
  ) => Promise<number>
  getFileVersionSummaries: (fileId: number | string) => Promise<FileVersionSummaryInfo[]>
  getById: (id: number, datasetVersionNumber?: string) => Promise<File | undefined>
  getMultipleFileDownloadUrl: (ids: number[], downloadMode: FileDownloadMode) => string
  getFileDownloadUrl: (id: number, downloadMode: FileDownloadMode) => string
  getAllByDatasetPersistentIdWithCount: (
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo?: FilePaginationInfo,
    criteria?: FileCriteria,
    includeDeaccessioned?: boolean
  ) => Promise<FilesWithCount>
  uploadFile: (
    datasetId: number | string,
    file: FileHolder,
    progress: (now: number) => void,
    abortController: AbortController,
    storageIdSetter: (storageId: string) => void
  ) => Promise<void>
  addUploadedFiles: (datasetId: number | string, files: UploadedFileDTO[]) => Promise<void>
  delete: (fileId: number | string) => Promise<void>
  replace: (fileId: number | string, uploadedFileDTO: UploadedFileDTO) => Promise<number>
  getFixityAlgorithm: () => Promise<FixityAlgorithm>
  updateMetadata: (fileId: number | string, fileMetadata: FileMetadataDTO) => Promise<void>
  restrict: (fileId: number | string, restrictFileDTO: RestrictFileDTO) => Promise<void>
}
