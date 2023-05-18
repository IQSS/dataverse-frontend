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
export enum CitationStatus {
  PUBLISHED,
  DRAFT,
  DEACCESSIONED
}
export interface Citation {
  value: string
  status: CitationStatus
  version: string | null
}

export interface Dataset {
  id: string
  title: string
  labels: DatasetLabel[]
  version: string
  citation: Citation
  summaryFields: DatasetField[]
  license: License
}
