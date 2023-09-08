export enum SettingName {
  ZIP_DOWNLOAD_LIMIT = 'ZIP_DOWNLOAD_LIMIT',
  ALLOWED_EXTERNAL_STATUSES = 'ALLOWED_EXTERNAL_STATUSES'
}

export interface Setting<T> {
  name: SettingName
  value: T
}
