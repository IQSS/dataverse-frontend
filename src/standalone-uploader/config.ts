export interface DvUploaderConfig {
  siteUrl: string
  datasetPid: string
  bearerToken?: string
  getBearerToken?: () => string | null | undefined
  locale?: string
  localesPath?: string
  rootElementId?: string
  disableMD5Checksum?: boolean
}

declare global {
  interface Window {
    dvUploaderConfig?: DvUploaderConfig
  }
}
