import { FileType } from './File'
import { FileAccessOption } from './FileCriteria'

export interface FilesCountInfo {
  total: number
  perFileType: FileTypeCount[]
  perAccess: FileAccessCount[]
}

export interface FileTypeCount {
  type: FileType
  count: number
}

export interface FileAccessCount {
  access: FileAccessOption
  count: number
}
