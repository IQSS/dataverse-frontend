import { File } from '../models/File'
import { FileCriteria } from '../models/FileCriteria'
import { FilesCountInfo } from '../models/FilesCountInfo'

export interface FileRepository {
  getAllByDatasetPersistentId: (
    datasetPersistentId: string,
    version?: string,
    criteria?: FileCriteria
  ) => Promise<File[]>
  getCountInfoByDatasetPersistentId: (
    datasetPersistentId: string,
    version?: string
  ) => Promise<FilesCountInfo>
}
