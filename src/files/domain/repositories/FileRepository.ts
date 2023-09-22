import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilesCountInfo } from '../models/FilesCountInfo'
import { FilePaginationInfo } from '../models/FilePaginationInfo'
import { FileUserPermissions } from '../models/FileUserPermissions'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

export interface FileRepository {
  getAllByDatasetPersistentId: (
    datasetPersistentId: string,
    datasetVersion: DatasetVersion,
    paginationInfo?: FilePaginationInfo,
    criteria?: FileCriteria
  ) => Promise<File[]>
  getCountInfoByDatasetPersistentId: (
    datasetPersistentId: string,
    datasetVersion: DatasetVersion
  ) => Promise<FilesCountInfo>
  getFileUserPermissionsById: (id: number) => Promise<FileUserPermissions>
}
