import { FileMetadata } from './FileMetadata'
import { FileIngest } from './FileIngest'
import { FileAccess } from './FileAccess'
import { DatasetPublishingStatus } from '../../../dataset/domain/models/Dataset'

export interface FilePreview {
  id: number
  name: string
  datasetPublishingStatus: DatasetPublishingStatus
  access: FileAccess
  ingest: FileIngest
  metadata: FileMetadata
}
