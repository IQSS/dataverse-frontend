import { LabelSemanticMeaning } from './LabelSemanticMeaning.enum'
import { MetadataBlockName } from './MetadataBlockName'

export interface DatasetLabel {
  semanticMeaning: LabelSemanticMeaning
  value: string
}

export type DatasetMetadataSubField = Record<string, string>

export type DatasetMetadataField = string | DatasetMetadataSubField[]

export type DatasetMetadataFields = Record<string, DatasetMetadataField>

export interface DatasetMetadataBlock {
  name: MetadataBlockName
  fields: DatasetMetadataFields
}

export interface Dataset {
  id: string
  title: string
  labels: DatasetLabel[]
  metadataBlocks: DatasetMetadataBlock[]
}
