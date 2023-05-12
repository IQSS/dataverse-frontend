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
export interface Citation {
  authors: string[]
  creationYear: number
  title: string
  persistentIdentifier: string
  persistentIdentifierUrl: string
  publisher: string
  version: string
  UNF?: string
  isDeaccessioned?: boolean
}
export interface Dataset {
  id: string
  title: string
  version: string
  citation: Citation
  summaryFields: DatasetField[]
  license: License
}
