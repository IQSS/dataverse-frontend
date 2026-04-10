export interface DatasetType {
  id: number
  name: string
  description: string
  linkedMetadataBlocks?: string[]
  availableLicenses?: string[]
}
