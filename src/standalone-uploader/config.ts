export interface DvUploaderConfig {
  siteUrl: string
  datasetPid: string
  bearerToken?: string
  getBearerToken?: () => string | null | undefined
  locale?: string
  localesPath?: string
  rootElementId?: string
}

declare global {
  interface Window {
    dvUploaderConfig?: DvUploaderConfig
  }
}
