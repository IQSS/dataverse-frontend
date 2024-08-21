import { FileMetadata } from './FileMetadata'
import { FileIngest } from './FileIngest'
import { FileAccess } from './FileAccess'
import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'
import { FilePermissions } from './FilePermissions'

export interface FilePreview {
  id: number
  name: string
  datasetPublishingStatus: DatasetPublishingStatus
  access: FileAccess
  ingest: FileIngest
  metadata: FileMetadata
  permissions: FilePermissions
  releaseOrCreateDate?: Date
  someDatasetVersionHasBeenReleased?: boolean
  datasetPersistentId?: string
  datasetName?: string
}
