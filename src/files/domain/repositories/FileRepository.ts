import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { FilePaginationInfo } from '../models/FilePaginationInfo'

export interface FileRepository {
  getAllByDatasetPersistentId: (
    datasetPersistentId: string,
    version?: string,
    paginationInfo?: FilePaginationInfo,
    criteria?: FileCriteria
  ) => Promise<File[]>
  getCountInfoByDatasetPersistentId: (
    datasetPersistentId: string,
    version?: string
  ) => Promise<FilesCountInfo>
}
