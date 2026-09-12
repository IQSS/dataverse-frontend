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
}

declare global {
  interface Window {
    dvTreeViewConfig?: DvTreeViewConfig
  }
}
