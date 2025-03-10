export interface UploadedFileInfo {
  key: string
  storageId: string
  checksumValue: string
  fileName: string
  fileDir: string | undefined
  fileType: string
  fileSize: number
  fileSizeString: string
  fileLastModified: number
}
