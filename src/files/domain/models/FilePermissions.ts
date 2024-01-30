export interface FilePermissions {
  canDownloadFile: boolean
  canEditDataset: boolean
}

export enum FilePermission {
  DOWNLOAD_FILE = 'downloadFile',
  EDIT_DATASET = 'editDataset'
}
