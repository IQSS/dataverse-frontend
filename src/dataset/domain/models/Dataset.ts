import { LabelSemanticMeaning } from './LabelSemanticMeaning.enum'

export interface DatasetLabel {
  semanticMeaning: LabelSemanticMeaning
  value: string
}

export interface DatasetField {
  title: string
  description: string
  value: string
}
export interface License {
  name: string
  shortDescription: string
  uri: string
  iconUrl?: string
}
export enum DatasetStatus {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DEACCESSIONED = 'deaccessioned'
}
export interface Citation {
  citationText: string
  pidUrl: string
  publisher: string
  unf?: string
}

export interface Dataset {
  id: string
  title: string
  labels: DatasetLabel[]
  version: string | null
  citation: Citation
  status: DatasetStatus
  summaryFields: DatasetField[]
  license: License
}
