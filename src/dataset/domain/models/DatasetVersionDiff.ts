import { DatasetVersionState } from './Dataset'

export interface DatasetVersionDiff {
  oldVersion: VersionSummary
  newVersion: VersionSummary
  metadataChanges?: MetadataBlockDiff[]
  filesAdded?: FileSummary[]
  filesRemoved?: FileSummary[]
  fileChanges?: FileDiff[]
  filesReplaced?: FileReplacement[]
  termsOfAccess?: {
    changed: FieldDiff[]
  }
}

export interface FileSummary {
  fileName: string
  MD5: string
  type: string
  fileId: number
  filePath: string
  description: string
  isRestricted: boolean
  tags: string[]
  categories: string[]
}

export interface VersionSummary {
  versionNumber: string
  lastUpdatedDate: string
  versionState: DatasetVersionState
}

export interface MetadataBlockDiff {
  blockName: string
  changed: FieldDiff[]
}

export interface FileDiff {
  fileName: string
  md5: string
  MD5?: string
  fileId: number
  changed: FieldDiff[]
}

export interface FileReplacement {
  oldFile: FileSummary
  newFile: FileSummary
}
export interface FieldDiff {
  fieldName: string
  oldValue: string
  newValue: string
}
