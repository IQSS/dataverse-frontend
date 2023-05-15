import { LabelSemanticMeaning } from './LabelSemanticMeaning.enum'

export interface DatasetLabel {
  semanticMeaning: LabelSemanticMeaning
  value: string
}

export type DatasetMetadataSubField = Record<string, string>

export type DatasetMetadataField = Record<string, string | DatasetMetadataSubField>

export interface DatasetMetadataBlock {
  title: string
  fields: DatasetMetadataField[]
}

export interface Dataset {
  id: string
  title: string
  labels: DatasetLabel[]
  metadataBlocks: DatasetMetadataBlock[]
}
