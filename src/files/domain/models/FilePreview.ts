import { FileMetadata } from './FileMetadata'
import { FileVersion } from './FileVersion'
import { FileIngest } from './FileIngest'
import { FileAccess } from './FileAccess'
import { FilePermissions } from './FilePermissions'

export interface FilePreview {
  id: number
  name: string
  version: FileVersion
  access: FileAccess
  ingest: FileIngest
  metadata: FileMetadata
  permissions: FilePermissions
}
