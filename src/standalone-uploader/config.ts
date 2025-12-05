/**
 * Standalone Uploader Configuration
 *
 * Parses URL parameters for the standalone file uploader.
 * Compatible with DVWebloader v1 URL params:
 *   - siteUrl: Base URL of the Dataverse instance
 *   - datasetPid: Persistent ID of the dataset
 *   - key: API key for authentication
 *   - dvLocale: Optional locale code (e.g., 'en', 'de')
 *   - useS3Tagging: Optional, set to 'false' to disable S3 tagging (for S3-compatible storage that doesn't support tagging)
 *   - maxRetries: Optional, maximum number of retries for multipart upload parts (default: 3)
 *   - uploadTimeoutMs: Optional, timeout in milliseconds for file upload operations (default: 0 = unlimited)
 *   - disableMD5Checksum: Optional, set to 'true' to disable MD5 checksum calculation
 */

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
 * Parse URL parameters and return configuration for the standalone uploader.
 */
export function parseUrlConfig(): ConfigParseResult {
  const queryParams = new URLSearchParams(window.location.search)

  const siteUrl = queryParams.get('siteUrl')
  const datasetPid = queryParams.get('datasetPid')
  const apiKey = queryParams.get('key')
  const dvLocale = queryParams.get('dvLocale') || 'en'

  // Parse useS3Tagging - default to true (enabled), only false if explicitly set to 'false'
  const useS3TaggingParam = queryParams.get('useS3Tagging')
  const useS3Tagging = useS3TaggingParam !== 'false'

  // Parse maxRetries - default to 3
  const maxRetriesParam = queryParams.get('maxRetries')
  const maxRetries = maxRetriesParam ? parseInt(maxRetriesParam, 10) : 3

  // Parse uploadTimeoutMs - default to 0 (unlimited)
  const uploadTimeoutMsParam = queryParams.get('uploadTimeoutMs')
  const uploadTimeoutMs = uploadTimeoutMsParam ? parseInt(uploadTimeoutMsParam, 10) : 0

  // Parse disableMD5Checksum - default to false
  const disableMD5ChecksumParam = queryParams.get('disableMD5Checksum')
  const disableMD5Checksum = disableMD5ChecksumParam === 'true'

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
