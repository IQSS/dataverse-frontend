export interface DatasetVersionDiff {
  oldVersion: VersionSummary
  newVersion: VersionSummary
  metadataChanges?: MetadataBlockDiff[]
  filesAdded?: FileSummary[]
  filesRemoved?: FileSummary[]
  fileChanges?: FileDiff[]
  filesReplaced?: FileReplacement[]
  termsOfAccess?: FieldDiff[]
  versionState?: DatasetVersionState
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
}
export interface MetadataBlockDiff {
  blockName: string
  changed: FieldDiff[]
}

export interface FileDiff {
  fileName: string
  md5: string
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

export declare enum DatasetVersionState {
  DRAFT = 'DRAFT',
  RELEASED = 'RELEASED',
  ARCHIVED = 'ARCHIVED',
  DEACCESSIONED = 'DEACCESSIONED'
}
