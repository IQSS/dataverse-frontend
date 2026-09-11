import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { ToastContainer } from 'react-toastify'
import { StandaloneFileUploaderPanel } from './StandaloneFileUploaderPanel'
import { StandaloneFileRepository } from './StandaloneFileRepository'
import { FileUploaderProvider } from '@/sections/shared/file-uploader/context/FileUploaderContext'
import { FileUploaderGlobalConfig } from '@/sections/shared/file-uploader/context/fileUploaderReducer'
import { OperationType, StorageType } from '@/sections/shared/file-uploader/FileUploader'
import { LoadingConfigSpinner } from '@/sections/shared/file-uploader/loading-config-spinner/LoadingConfigSpinner'
import { useGetFixityAlgorithm } from '@/sections/shared/file-uploader/useGetFixityAlgorithm'
import { mountInShadowRoot, unmountQuietly } from '../standalone-shared/shadow-mount'
import { configureSdkAuth } from '../standalone-shared/auth'

import '../../packages/design-system/dist/style.css'
import 'react-toastify/dist/ReactToastify.css'
import './standalone.scss'

interface WrapperProps {
  fileRepository: StandaloneFileRepository
  datasetPersistentId: string
  siteUrl: string
}

function UploaderWrapper({ fileRepository, datasetPersistentId, siteUrl }: WrapperProps) {
  const { fixityAlgorithm, isLoadingFixityAlgorithm } = useGetFixityAlgorithm(fileRepository)

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

let mountedHostElement: HTMLElement | null = null
let mountedReactRoot: Root | null = null
let i18nReady: Promise<void> | null = null

async function init(opts: { fromObserver?: boolean } = {}) {
  const config = window.dvUploaderConfig
  const rootElementId = config?.rootElementId ?? 'dv-uploader'

  const hostElement = document.getElementById(rootElementId)
  if (!hostElement) return
  if (hostElement === mountedHostElement && mountedReactRoot) return
  if (opts.fromObserver && !config) return
  if (mountedReactRoot) {
    unmountQuietly(mountedReactRoot)
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

  if (!isValidSiteUrl(config.siteUrl)) {
    root.render(
      <StrictMode>
        <div className="dv-uploader-root">
          <div className="standalone-error">
            <p>
              dvUploader: <code>siteUrl</code> must be an absolute http(s) URL.
            </p>
            <p>
              Got: <code>{config.siteUrl}</code>
            </p>
          </div>
        </div>
      </StrictMode>
    )
    return
  }

  configureSdkAuth(config.siteUrl, {
    bearerToken: config.bearerToken,
    getBearerToken: config.getBearerToken
  })

  const localesPath =
    config.localesPath ??
    `${new URL(/* @vite-ignore */ './locales/', import.meta.url).href}{{lng}}/{{ns}}.json`

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
        <ToastContainer position="top-right" autoClose={5000} style={{ top: '80px' }} />
        <UploaderWrapper
          fileRepository={fileRepository}
          datasetPersistentId={config.datasetPid}
          siteUrl={config.siteUrl}
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
      init({ fromObserver: true }).catch((error) => {
        console.error('[dvUploader] re-init failed:', error)
      })
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}

function isValidSiteUrl(raw: string | undefined): boolean {
  if (!raw) return false
  try {
    const u = new URL(raw)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}
