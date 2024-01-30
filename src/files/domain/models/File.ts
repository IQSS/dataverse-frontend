import { DatasetVersion } from '../../../dataset/domain/models/Dataset'
import { FilePermissions } from './FilePermissions'

export interface File {
  name: string
  datasetVersion: DatasetVersion
  citation: string
  restricted: boolean
  permissions: FilePermissions
}
