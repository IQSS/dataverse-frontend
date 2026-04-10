export interface DatasetType {
  id: number
  name: string
  displayName: string
  linkedMetadataBlocks?: string[]
  availableLicenses?: string[]
  description?: string
}