export interface FileMetadataDTO {
  label?: string
  directoryLabel?: string
  description?: string
  // Not sure if we need the next 3 fields
  categories?: string[]
  dataFileTags?: string[]
  restrict?: boolean
}
