export interface DvTreeViewConfig {
  siteUrl: string
  datasetPid: string
  datasetVersionId?: string
  bearerToken?: string
  getBearerToken?: () => string | null | undefined
  locale?: string
  localesPath?: string
  rootElementId?: string
  fileMetadataPath?: string
  zipServiceWorkerUrl?: string
}

declare global {
  interface Window {
    dvTreeViewConfig?: DvTreeViewConfig
  }
}
