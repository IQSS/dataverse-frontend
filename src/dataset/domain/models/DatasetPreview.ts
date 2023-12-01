import { DatasetLabel, DatasetVersion } from './Dataset'

export interface DatasetPreview {
  persistentId: string
  title: string
  version: DatasetVersion
  citation: string
  labels: DatasetLabel[]
  thumbnail?: string
  isDeaccessioned: boolean
  releaseOrCreateDate: Date
}
