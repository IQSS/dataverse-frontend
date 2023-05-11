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
export interface Dataset {
  id: string
  title: string
  version: string
  displayCitation: string
  summaryFields: DatasetField[]
  license: License
}
