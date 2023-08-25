import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { FilePaginationInfo } from '../models/FilePaginationInfo'
import { FileUserPermissions } from '../models/FileUserPermissions'

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
  getFileUserPermissionsById: (id: number) => Promise<FileUserPermissions>
}
