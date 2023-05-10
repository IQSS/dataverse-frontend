import { DatasetField } from './DatasetField'
import { License } from './License'

export interface Dataset {
  id: string
  title: string
  version: string
  displayCitation: string
  summaryFields: DatasetField[]
  license: License
}
