export enum FileIngestStatus {
  NONE = 'none',
  IN_PROGRESS = 'inProgress',
  SCHEDULED = 'scheduled',
  ERROR = 'error'
}

export class FileIngest {
  constructor(readonly status: FileIngestStatus, readonly message?: string) {}

  get isInProgress(): boolean {
    return this.status === FileIngestStatus.IN_PROGRESS
  }
}
