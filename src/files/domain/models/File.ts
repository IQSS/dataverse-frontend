import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import {
  FileChecksum,
  FileDownloadUrls,
  FileEmbargo,
  FileLabel,
  FileSize,
  FileTabularData,
  FileType,
  FileVersion
} from './FilePreview'

export interface FilePermissions {
  canDownloadFile: boolean
}

export interface File {
  name: string
  version: FileVersion
  datasetVersion: DatasetVersion
  type: FileType
  size: FileSize
  restricted: boolean
  permissions: FilePermissions
  labels: FileLabel[]
  downloadUrls: FileDownloadUrls
  depositDate: Date
  publicationDate?: Date
  persistentId?: string
  thumbnail?: string
  directory?: string
  tabularData?: FileTabularData
  checksum?: FileChecksum
  embargo?: FileEmbargo
}
