import { FileType } from './File'

export interface FilesCountInfo {
  total: number
  perFileType: FileTypeCount[]
}

export interface FileTypeCount {
  type: FileType
  count: number
}
