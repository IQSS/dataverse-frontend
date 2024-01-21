import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

export interface FilePermissions {
  canDownloadFile: boolean
}

export interface File {
  name: string
  datasetVersion: DatasetVersion
  citation: string
  restricted: boolean
  permissions: FilePermissions
}
