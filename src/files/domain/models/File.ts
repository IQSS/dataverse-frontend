import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileChecksum, FileDownloadUrls, FileLabel, FileTabularData, FileType } from './FilePreview'

export interface FilePermissions {
  canDownloadFile: boolean
}

export interface File {
  name: string
  datasetVersion: DatasetVersion
  type: FileType
  restricted: boolean
  permissions: FilePermissions
  labels: FileLabel[]
  downloadUrls: FileDownloadUrls
  persistentId?: string
  thumbnail?: string
  tabularData?: FileTabularData
  checksum?: FileChecksum
}
