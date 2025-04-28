export interface DatasetVersionSummaryInfo {
  id: number
  versionNumber: string
  summary?: DatasetVersionSummary | DatasetVersionSummaryStringValues
  contributors: string
  publishedOn?: string
}

export type DatasetVersionSummary = {
  [key: string]:
    | SummaryUpdates
    | SummaryUpdatesWithFields
    | FilesSummaryUpdates
    | Deaccessioned
    | boolean
}

interface Deaccessioned {
  reason: string
  url: string
}

export interface SummaryUpdates {
  added: number
  deleted: number
  changed: number
}

interface SummaryUpdatesWithFields {
  [key: string]: SummaryUpdates
}

export interface FilesSummaryUpdates {
  added: number
  removed: number
  replaced: number
  changedFileMetaData: number
  changedVariableMetadata: number
}

export enum DatasetVersionSummaryStringValues {
  firstPublished = 'firstPublished',
  firstDraft = 'firstDraft',
  versionDeaccessioned = 'versionDeaccessioned',
  previousVersionDeaccessioned = 'previousVersionDeaccessioned'
}
