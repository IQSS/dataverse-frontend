export enum SettingName {
  ZIP_DOWNLOAD_LIMIT = 'ZIP_DOWNLOAD_LIMIT'
}

export interface Setting<T> {
  name: SettingName
  value: T
}
