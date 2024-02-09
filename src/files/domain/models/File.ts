import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileMetadata } from './FileMetadata'
import { FileVersion } from './FileVersion'
import { FileAccess } from './FileAccess'
import { FilePermissions } from './FilePermissions'
import { FileIngest } from './FileIngest'

export interface File {
  id: number
  version: FileVersion
  name: string
  access: FileAccess
  datasetVersion: DatasetVersion
  citation: string
  permissions: FilePermissions
  metadata: FileMetadata
  ingest: FileIngest
}
