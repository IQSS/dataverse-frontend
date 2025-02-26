import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FileMetadata } from './FileMetadata'
import { FileAccess } from './FileAccess'
import { FilePermissions } from './FilePermissions'
import { FileIngest } from './FileIngest'
import { UpwardHierarchyNode } from '../../../shared/hierarchy/domain/models/UpwardHierarchyNode'

export interface File {
  id: number
  datasetPersistentId: string
  name: string
  access: FileAccess
  datasetVersion: DatasetVersion
  citation: string
  hierarchy: UpwardHierarchyNode
  permissions: FilePermissions
  metadata: FileMetadata
  ingest: FileIngest
}
