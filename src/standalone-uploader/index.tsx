import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { ApiConfig, DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript'
import { ToastContainer } from 'react-toastify'
import { StandaloneFileUploaderPanel } from './StandaloneFileUploaderPanel'
import { StandaloneFileRepository } from './StandaloneFileRepository'
import { FileUploaderProvider } from '@/sections/shared/file-uploader/context/FileUploaderContext'
import { FileUploaderGlobalConfig } from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { OperationType, StorageType } from '@/sections/shared/file-uploader/FileUploader'
import { LoadingConfigSpinner } from '@/sections/shared/file-uploader/loading-config-spinner/LoadingConfigSpinner'
import { useGetFixityAlgorithm } from '@/sections/shared/file-uploader/useGetFixityAlgorithm'
import { FixityAlgorithm } from '@/files/domain/models/FixityAlgorithm'
import { mountInShadowRoot } from '../standalone-shared/shadow-mount'

import '../../packages/design-system/dist/style.css'
// Bootstrap 5 base CSS is intentionally NOT imported here. The standalone
// bundle is mounted into pages whose own CSS context (e.g. JSF Bootstrap 3,
// or an external host's stylesheet) we must not perturb. Component styles
// are CSS-Modules with hashed class names. The standalone *demo* HTML page
// (`dvwebloaderV2.html`) imports Bootstrap directly via a <link> tag for
// its own page chrome.
import 'react-toastify/dist/ReactToastify.css'
import './standalone.scss'

interface WrapperProps {
  fileRepository: StandaloneFileRepository
  datasetPersistentId: string
  siteUrl: string
  disableMD5Checksum?: boolean
}

function UploaderWrapper({
  fileRepository,
  datasetPersistentId,
  siteUrl,
  disableMD5Checksum
}: WrapperProps) {
  const { fixityAlgorithm: fetchedAlgorithm, isLoadingFixityAlgorithm } =
    useGetFixityAlgorithm(fileRepository)

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

// Module-scope state mirrors the tree-view bundle: needed so
// PrimeFaces partial updates that re-insert the uploader host div are
// detected and remounted (otherwise the orphaned root sits attached to
// a div that's no longer in the document, and the user sees nothing).
let mountedHostElement: HTMLElement | null = null
let mountedReactRoot: Root | null = null
let i18nReady: Promise<void> | null = null

async function init() {
  const config = window.dvUploaderConfig
  const rootElementId = config?.rootElementId ?? 'dv-uploader'

  const hostElement = document.getElementById(rootElementId)
  if (!hostElement) return
  if (hostElement === mountedHostElement && mountedReactRoot) return
  if (mountedReactRoot) {
    try {
      mountedReactRoot.unmount()
    } catch {
      // Previous host already detached; React's commit-phase teardown
      // throws but we're discarding the reference anyway.
    }
    mountedReactRoot = null
  }

  let reactRoot: HTMLElement
  try {
    reactRoot = mountInShadowRoot({ rootElementId }).reactRoot
  } catch (err) {
    console.error(`[dvUploader] ${(err as Error).message}`)
    return
  }

  const root = createRoot(reactRoot)
  mountedHostElement = hostElement
  mountedReactRoot = root

  const missingFields: string[] = []
  if (!config) missingFields.push('siteUrl', 'datasetPid')
  else {
    if (!config.siteUrl) missingFields.push('siteUrl')
    if (!config.datasetPid) missingFields.push('datasetPid')
  }

  if (missingFields.length > 0 || !config) {
    root.render(
      <StrictMode>
        <div className="dv-uploader-root">
          <div className="standalone-error">
            <p>
              dvUploader: missing required config: <code>{missingFields.join(', ')}</code>
            </p>
            <p>
              Set <code>window.dvUploaderConfig</code> before loading the script.
            </p>
          </div>
        </div>
      </StrictMode>
    )
    return
  }

  ApiConfig.init(`${config.siteUrl}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)

  const localesPath =
    config.localesPath ?? `${config.siteUrl}/dvwebloader/locales/{{lng}}/{{ns}}.json`

  if (!i18nReady) {
    i18nReady = i18next
      .use(initReactI18next)
      .use(I18NextHttpBackend)
      .init({
        lng: config.locale ?? 'en',
        fallbackLng: 'en',
        supportedLngs: ['en', 'de', 'fr', 'es', 'it', 'nl', 'pt', 'uk'],
        lowerCaseLng: true,
        ns: ['shared'],
        defaultNS: 'shared',
        returnNull: false,
        backend: { loadPath: localesPath }
      })
      .then(() => undefined)
  }
  await i18nReady

  const fileRepository = new StandaloneFileRepository(config.siteUrl)

  root.render(
    <StrictMode>
      <div className="dv-uploader-root">
        <ToastContainer position="top-right" autoClose={5000} />
        <UploaderWrapper
          fileRepository={fileRepository}
          datasetPersistentId={config.datasetPid}
          siteUrl={config.siteUrl}
          disableMD5Checksum={config.disableMD5Checksum}
        />
      </div>
    </StrictMode>
  )
}

init().catch((error) => {
  console.error('[dvUploader] init failed:', error)
})

if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(() => {
    const config = window.dvUploaderConfig
    const rootElementId = config?.rootElementId ?? 'dv-uploader'
    const current = document.getElementById(rootElementId)
    if (current && current !== mountedHostElement) {
      init().catch((error) => {
        console.error('[dvUploader] re-init failed:', error)
      })
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
