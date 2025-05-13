export interface FileVersionSummaryInfo {
  datasetVersion: string
  contributors?: string
  datafileId: number
  publishedDate?: string
  fileDifferenceSummary?: FileDifferenceSummary
  versionState?: FileVersionState
  versionNote?: string
}

export enum FileVersionState {
  RELEASED = 'RELEASED',
  DEACCESSIONED = 'DEACCESSIONED',
  DRAFT = 'DRAFT'
}

export type FileDifferenceSummary = {
  file?: FileChangeType
  FileAccess?: string
  FileMetadata?: FileMetadataChange[]
  deaccessionedReason?: string
  FileTags?: FileTagChange
}

export type FileChangeType = 'Added' | 'Deleted' | 'Replaced' | 'Changed'

export type FileTagChange = {
  Added?: number
  Deleted?: number
}

export interface FileMetadataChange {
  name: string
  action: FileChangeType
}
