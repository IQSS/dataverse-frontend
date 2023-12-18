import { DatasetVersion } from '../../../dataset/domain/models/Dataset'

export interface File {
  name: string
  datasetVersion: DatasetVersion
}
