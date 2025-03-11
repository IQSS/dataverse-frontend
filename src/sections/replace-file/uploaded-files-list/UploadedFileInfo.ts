import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'

export interface UploadedFileInfo {
  key: string
  storageId: string
  checksumValue: string
  checksumAlgorithm: FixityAlgorithm
  fileName: string
  fileDir: string
  fileType: string
  fileSize: number
  fileSizeString: string
  fileLastModified: number
}
