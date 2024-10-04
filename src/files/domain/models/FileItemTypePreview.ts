import { CollectionItemType } from '../../../collection/domain/models/CollectionItemType'
import { PublicationStatus } from '../../../shared/core/domain/models/PublicationStatus'

export interface FileItemTypePreview {
  type: CollectionItemType.FILE
  id: number
  name: string
  persistentId?: string
  url: string
  thumbnail?: string
  description: string
  fileType: string
  fileContentType: string
  sizeInBytes: number
  md5?: string
  checksum?: FilePreviewChecksum
  unf?: string
  datasetName: string
  datasetId: number
  datasetPersistentId: string
  datasetCitation: string
  publicationStatuses: PublicationStatus[]
  releaseOrCreateDate: Date
}

export interface FilePreviewChecksum {
  type: string
  value: string
}
