/**
 * Standalone Uploader Configuration
 *
 * Configuration can be set in two ways:
 * 1. Window variables (set via script tag in HTML before the bundle loads):
 *    - window.dvWebloaderConfig = { useS3Tagging: false, maxRetries: 5, ... }
 * 2. URL parameters (for siteUrl, datasetPid, key, dvLocale)
 *
 * URL Parameters (passed by Dataverse):
 *   - siteUrl: Base URL of the Dataverse instance
 *   - datasetPid: Persistent ID of the dataset
 *   - key: API key for authentication
 *   - dvLocale: Optional locale code (e.g., 'en', 'de')
 *
 * Window config options (set in HTML):
 *   - useS3Tagging: Set to false to disable S3 tagging (default: true)
 *   - maxRetries: Maximum retries for multipart upload parts (default: 3)
 *   - uploadTimeoutMs: Timeout in ms for uploads, 0 = unlimited (default: 0)
 *   - disableMD5Checksum: Set to true to skip checksum calculation (default: false)
 */

/** Window config interface for type safety */
interface DvWebloaderWindowConfig {
  useS3Tagging?: boolean
  maxRetries?: number
  uploadTimeoutMs?: number
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
  apiKey: string
  dvLocale: string
  /** Whether to use S3 object tagging. Set to false for S3-compatible storage that doesn't support tagging. Default: true */
  useS3Tagging: boolean
  /** Maximum number of retries for multipart upload parts. Default: 3 */
  maxRetries: number
  /** Timeout in milliseconds for file upload operations. 0 means unlimited. Default: 0 (unlimited) */
  uploadTimeoutMs: number
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
  const apiKey = queryParams.get('key')
  const dvLocale = queryParams.get('dvLocale') || 'en'

  // Parse useS3Tagging - window config takes precedence, then default to true
  const useS3Tagging = windowConfig.useS3Tagging ?? true

  // Parse maxRetries - window config takes precedence, then default to 3
  const maxRetries = windowConfig.maxRetries ?? 3

  // Parse uploadTimeoutMs - window config takes precedence, then default to 0 (unlimited)
  const uploadTimeoutMs = windowConfig.uploadTimeoutMs ?? 0

  // Parse disableMD5Checksum - window config takes precedence, then default to false
  const disableMD5Checksum = windowConfig.disableMD5Checksum ?? false

  const missingParams: string[] = []

  if (!siteUrl) missingParams.push('siteUrl')
  if (!datasetPid) missingParams.push('datasetPid')
  if (!apiKey) missingParams.push('key')

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
      apiKey: apiKey as string,
      dvLocale,
      useS3Tagging,
      maxRetries,
      uploadTimeoutMs,
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
