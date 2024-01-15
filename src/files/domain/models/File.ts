import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileType } from './FilePreview'

export interface FilePermissions {
  canDownloadFile: boolean
}

export interface File {
  name: string
  datasetVersion: DatasetVersion
  type: FileType
  restricted: boolean
  permissions: FilePermissions
  thumbnail?: string
}
