import { DatasetLabel } from './Dataset'

export interface DatasetPreview {
  persistentId: string
  title: string
  labels: DatasetLabel[]
}
