export enum LabelSemanticMeaning {
  DATASET = 'dataset',
  FILE = 'file',
  SUCCESS = 'success',
  INFO = 'info',
  WARNING = 'warning',
  DANGER = 'danger'
}

export interface DatasetLabel {
  semanticMeaning: LabelSemanticMeaning
  value: string
}

export type DatasetMetadataSubField = Record<string, string>

export const ANONYMIZED_FIELD_VALUE = 'withheld'
type AnonymizedField = typeof ANONYMIZED_FIELD_VALUE

export type DatasetMetadataField = string | DatasetMetadataSubField[] | AnonymizedField

export type DatasetMetadataFields = Record<string, DatasetMetadataField>

export enum MetadataBlockName {
  CITATION = 'citation',
  GEOSPATIAL = 'geospatial',
  ASTROPHYSICS = 'astrophysics',
  BIOMEDICAL = 'biomedical',
  CODE_META = 'codeMeta20',
  COMPUTATIONAL_WORKFLOW = 'computationalworkflow',
  CUSTOM_ARCS = 'customARCS',
  CUSTOM_CHIA = 'customCHIA',
  CUSTOM_DIGAAI = 'customDigaai',
  CUSTOM_GSD = 'customGSD',
  CUSTOM_MRA = 'customMRA',
  CUSTOM_PSI = 'customPSI',
  CUSTOM_PSRI = 'customPSRI',
  CUSTOM_HBGDKI = 'custom_hbgdki',
  JOURNAL = 'journal',
  SOCIAL_SCIENCE = 'socialscience'
}

export interface DatasetMetadataBlock {
  name: MetadataBlockName
  fields: DatasetMetadataFields
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
  metadataBlocks: DatasetMetadataBlock[]
}
