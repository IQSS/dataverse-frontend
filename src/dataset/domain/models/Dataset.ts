import { DatasetField } from './DatasetField'

export interface Dataset {
  id: string
  title: string
  version: string
  summaryFields: DatasetField[]
}
