/**
 * Standalone Uploader Configuration
 *
 * Configuration can be set in two ways:
 * 1. Window variables (set via script tag in HTML before the bundle loads):
 *    - window.dvWebloaderConfig = { disableMD5Checksum: true }
 * 2. URL parameters (for siteUrl, datasetPid, dvLocale)
 *
 * URL Parameters (passed by Dataverse):
 *   - siteUrl: Base URL of the Dataverse instance
 *   - datasetPid: Persistent ID of the dataset
 *   - dvLocale: Optional locale code (e.g., 'en', 'de')
 *
 * Window config options (set in HTML):
 *   - disableMD5Checksum: Set to true to skip checksum calculation (default: false)
 */

/** Window config interface for type safety */
interface DvWebloaderWindowConfig {
  disableMD5Checksum?: boolean
}

declare global {
  interface Window {
    dvWebloaderConfig?: DvWebloaderWindowConfig
  }
}

export interface StandaloneUploaderConfig {
  siteUrl: string
  datasetPid: string
  dvLocale: string
  /** Whether to disable MD5 checksum calculation. Default: false */
  disableMD5Checksum: boolean
}

export interface ConfigResult {
  ok: true
  config: StandaloneUploaderConfig
}

export interface ConfigError {
  ok: false
  error: string
  missingParams: string[]
}

export type ConfigParseResult = ConfigResult | ConfigError

/**
 * Parse URL parameters and window config, return configuration for the standalone uploader.
 */
export function parseUrlConfig(): ConfigParseResult {
  const queryParams = new URLSearchParams(window.location.search)
  const windowConfig = window.dvWebloaderConfig || {}

  const siteUrl = queryParams.get('siteUrl')
  const datasetPid = queryParams.get('datasetPid')
  const dvLocale = queryParams.get('dvLocale') || 'en'

  const disableMD5Checksum = windowConfig.disableMD5Checksum ?? false

  const missingParams: string[] = []

  if (!siteUrl) missingParams.push('siteUrl')
  if (!datasetPid) missingParams.push('datasetPid')

  if (missingParams.length > 0) {
    return {
      ok: false,
      error: `Missing required URL parameters: ${missingParams.join(', ')}`,
      missingParams
    }
  }

  return {
    ok: true,
    config: {
      siteUrl: siteUrl as string,
      datasetPid: datasetPid as string,
      dvLocale,
      disableMD5Checksum
    }
  }
}

/**
 * Extract the dataset ID from either a persistent ID or numeric ID.
 * The API accepts both formats.
 */
export function getDatasetIdentifier(datasetPid: string): string {
  return datasetPid
}
