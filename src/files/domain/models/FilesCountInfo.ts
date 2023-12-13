import { FileType } from './FilePreview'
import { FileAccessOption, FileTag } from './FileCriteria'

export interface FilesCountInfo {
  total: number
  perFileType: FileTypeCount[]
  perAccess: FileAccessCount[]
  perFileTag: FileTagCount[]
}

export interface FileTypeCount {
  type: FileType
  count: number
}

export interface FileAccessCount {
  access: FileAccessOption
  count: number
}

export interface FileTagCount {
  tag: FileTag
  count: number
}
