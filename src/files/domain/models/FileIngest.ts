export enum FileIngestStatus {
  NONE = 'none',
  IN_PROGRESS = 'inProgress',
  SCHEDULED = 'scheduled',
  ERROR = 'error'
}

export interface FileIngest {
  status: FileIngestStatus
  reportMessage?: string
}
