import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileMetadata } from './FileMetadata'
import { FileVersion } from './FileVersion'
import { FileAccess } from './FileAccess'
import { FileUserPermissions } from './FileUserPermissions'

export interface File {
  version: FileVersion
  name: string
  access: FileAccess
  datasetVersion: DatasetVersion
  citation: string
  permissions: FileUserPermissions
  metadata: FileMetadata
}
