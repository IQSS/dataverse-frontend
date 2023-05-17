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

export type DatasetMetadataField = string | DatasetMetadataSubField[]

export type DatasetMetadataFields = Record<string, DatasetMetadataField>

export enum MetadataBlockName {
  CITATION = 'citation',
  GEOSPATIAL = 'geospatial',
  ASTROPHYSICS = 'astrophysics',
  BIOMEDICAL = 'biomedical',
  CODE_META = 'codeMeta20',
  COMPUTATIONAL_WORKFLOW = 'computationalWorkflow',
  CUSTOM_ARCS = 'customARCS',
  CUSTOM_CHIA = 'customCHIA',
  CUSTOM_DIGAAI = 'customDigaai',
  CUSTOM_GSD = 'customGSD',
  CUSTOM_MRA = 'customMRA',
  CUSTOM_PSI = 'customPSI',
  CUSTOM_PSRI = 'customPSRI',
  CUSTOM_HBGDKI = 'custom_hbgdki',
  JOURNALS = 'journals',
  SOCIAL_SCIENCE = 'socialscience'
}

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
