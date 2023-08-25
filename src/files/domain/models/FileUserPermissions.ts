export interface FileUserPermissions {
  fileId: number
  canDownloadFile: boolean
  canEditDataset: boolean
}

export enum FilePermission {
  DOWNLOAD_FILE = 'downloadFile',
  EDIT_DATASET = 'editDataset'
}
