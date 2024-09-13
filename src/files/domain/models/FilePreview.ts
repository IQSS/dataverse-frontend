import { FileMetadata } from './FileMetadata'
import { FileIngest } from './FileIngest'
import { FileAccess } from './FileAccess'
import {
  DatasetPublishingStatus,
  DatasetVersionNumber
} from '../../../dataset/domain/models/Dataset'
import { FilePermissions } from './FilePermissions'

// TODO:ME Once 181 is merged, update interface

export interface FilePreview {
  id: number
  name: string
  datasetPublishingStatus: DatasetPublishingStatus
  access: FileAccess
  ingest: FileIngest
  metadata: FileMetadata
  permissions: FilePermissions
  datasetVersionNumber?: DatasetVersionNumber
  releaseOrCreateDate?: Date
  someDatasetVersionHasBeenReleased?: boolean
  datasetPersistentId?: string
  datasetName?: string
}
