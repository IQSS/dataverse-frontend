export enum FilePublishingStatus {
  DRAFT = 'draft',
  RELEASED = 'released',
  DEACCESSIONED = 'deaccessioned'
}

export interface FileVersion {
  number: number
  publishingStatus: FilePublishingStatus
}
