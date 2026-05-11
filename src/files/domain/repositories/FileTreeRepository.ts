import { FileTreePage, FileTreeInclude, FileTreeOrder } from '../models/FileTreePage'
import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

export interface GetFileTreeNodeParams {
  datasetPersistentId: string
  datasetVersion: DatasetVersion
  path?: string
  limit?: number
  cursor?: string
  include?: FileTreeInclude
  order?: FileTreeOrder
  includeDeaccessioned?: boolean
  originals?: boolean
}

export interface FileTreeRepository {
  getNode: (params: GetFileTreeNodeParams) => Promise<FileTreePage>
}
