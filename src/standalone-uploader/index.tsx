/**
 * Standalone Uploader Entry Point
 *
 * This is the entry point for the standalone DVWebloader V2 bundle.
 * It initializes React, i18n, and the API client, then mounts the uploader.
 *
 * This standalone version reuses the SPA's FileUploader components to avoid code duplication.
 */

import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { ApiConfig, FilesConfig } from '@iqss/dataverse-client-javascript'
import { DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript/dist/core/infra/repositories/ApiConfig'
import { ToastContainer } from 'react-toastify'
import { parseUrlConfig } from './config'
import { StandaloneFileUploaderPanel } from './StandaloneFileUploaderPanel'
import { StandaloneFileRepository } from './StandaloneFileRepository'
import { FileUploaderProvider } from '@/sections/shared/file-uploader/context/FileUploaderContext'
import { FileUploaderGlobalConfig } from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { OperationType, StorageType } from '@/sections/shared/file-uploader/FileUploader'
import { LoadingConfigSpinner } from '@/sections/shared/file-uploader/loading-config-spinner/LoadingConfigSpinner'
import { useGetFixityAlgorithm } from '@/sections/shared/file-uploader/useGetFixityAlgorithm'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'

// Import design system styles - use relative path for build compatibility
import '../../packages/design-system/dist/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import './standalone.scss'

// Error display component
function ConfigErrorDisplay({ error, missingParams }: { error: string; missingParams: string[] }) {
  return (
    <div className="standalone-error">
      <h1>Configuration Error</h1>
      <p>{error}</p>
      {missingParams.length > 0 && (
        <div>
          <p>Expected URL format:</p>
          <code>
            ?siteUrl=https://your-dataverse.edu&datasetPid=doi:10.5072/FK2/XXXXX&key=your-api-key
          </code>
        </div>
      )}
    </div>
  )
}

// Standalone uploader wrapper that loads fixity algorithm and provides context
interface StandaloneUploaderWrapperProps {
  fileRepository: StandaloneFileRepository
  datasetPersistentId: string
  siteUrl: string
  disableMD5Checksum?: boolean
}

function StandaloneUploaderWrapper({
  fileRepository,
  datasetPersistentId,
  siteUrl,
  disableMD5Checksum
}: StandaloneUploaderWrapperProps) {
  const { fixityAlgorithm: fetchedAlgorithm, isLoadingFixityAlgorithm } =
    useGetFixityAlgorithm(fileRepository)

  // If checksum is disabled, use NONE. Otherwise use the fetched algorithm.
  const fixityAlgorithm = disableMD5Checksum ? FixityAlgorithm.NONE : fetchedAlgorithm

  if (isLoadingFixityAlgorithm) {
    return <LoadingConfigSpinner />
  }

  const initialConfig: FileUploaderGlobalConfig = {
    storageType: 'S3' as StorageType,
    operationType: OperationType.ADD_FILES_TO_DATASET,
    checksumAlgorithm: fixityAlgorithm
  }

  return (
    <FileUploaderProvider initialConfig={initialConfig}>
      <StandaloneFileUploaderPanel
        fileRepository={fileRepository}
        datasetPersistentId={datasetPersistentId}
        siteUrl={siteUrl}
      />
    </FileUploaderProvider>
  )
}

// Initialize the application
async function init() {
  const container = document.getElementById('root')
  if (!container) {
    console.error('Root element not found')
    return
  }

  const root = createRoot(container)

  // Parse URL configuration
  const configResult = parseUrlConfig()

  if (!configResult.ok) {
    root.render(
      <StrictMode>
        <ConfigErrorDisplay error={configResult.error} missingParams={configResult.missingParams} />
      </StrictMode>
    )
    return
  }

  const config = configResult.config

  // Initialize the API client with API key authentication
  ApiConfig.init(`${config.siteUrl}/api/v1`, DataverseApiAuthMechanism.API_KEY, config.apiKey)

  // Configure file upload settings
  // These are critical for S3-compatible storage that may not support all S3 features
  FilesConfig.init({
    // useS3Tagging: Set to false for MinIO/S3-compatible storage without tagging support
    useS3Tagging: config.useS3Tagging,
    // maxMultipartRetries: Number of retry attempts for multipart upload failures
    maxMultipartRetries: config.maxRetries,
    // fileUploadTimeoutMs: Timeout for upload operations (0 = use axios default)
    fileUploadTimeoutMs: config.uploadTimeoutMs || undefined
  })

  // Determine the base path for loading translation files
  // In standalone mode, translations are bundled or loaded from the same origin
  const basePath = window.location.pathname.substring(
    0,
    window.location.pathname.lastIndexOf('/') + 1
  )

  // Initialize i18next for translations
  await i18next
    .use(initReactI18next)
    .use(I18NextHttpBackend)
    .init({
      lng: config.dvLocale || 'en',
      fallbackLng: 'en',
      supportedLngs: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt', 'uk'],
      lowerCaseLng: true,
      ns: ['shared'],
      defaultNS: 'shared',
      returnNull: false,
      backend: {
        loadPath: `${basePath}locales/{{lng}}/{{ns}}.json`
      }
    })

  // Create standalone file repository (doesn't depend on config.js)
  const fileRepository = new StandaloneFileRepository(config.siteUrl)

  // Render the uploader with context provider
  root.render(
    <StrictMode>
      <div className="standalone-uploader-container">
        <ToastContainer position="top-right" autoClose={5000} />
        <StandaloneUploaderWrapper
          fileRepository={fileRepository}
          datasetPersistentId={config.datasetPid}
          siteUrl={config.siteUrl}
          disableMD5Checksum={config.disableMD5Checksum}
        />
      </div>
    </StrictMode>
  )
}

// Start the application
init().catch((error) => {
  console.error('Failed to initialize standalone uploader:', error)
})
