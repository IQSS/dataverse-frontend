export interface StorageDriver {
  name: string
  type?: string
  label?: string
  directUpload: boolean
  directDownload: boolean
  uploadOutOfBand: boolean
}
