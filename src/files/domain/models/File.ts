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
import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

export interface FilePermissions {
  canDownloadFile: boolean
}

export interface File {
  name: string
  version: FileVersion
  datasetVersion: DatasetVersion
  type: FileType
  size: FileSize
  citation: string
  restricted: boolean
  permissions: FilePermissions
  labels: FileLabel[]
  downloadUrls: FileDownloadUrls
  depositDate: Date
  hierarchy: UpwardHierarchyNode
  publicationDate?: Date
  persistentId?: string
  thumbnail?: string
  directory?: string
  tabularData?: FileTabularData
  description?: string
  checksum?: FileChecksum
  embargo?: FileEmbargo
}
