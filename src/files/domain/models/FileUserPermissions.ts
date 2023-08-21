export interface FileUserPermissions {
  fileId: string
  canDownloadFile: boolean
  canEditDataset: boolean
}

export enum FilePermission {
  DOWNLOAD_FILE = 'downloadFile'
}
