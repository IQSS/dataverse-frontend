import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { ToastContainer } from 'react-toastify'
import { FilesTree } from '@/sections/dataset/dataset-files/files-tree/FilesTree'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import { SdkFilePreviewSource } from '@/files/infrastructure/repositories/SdkFilePreviewSource'
import { DatasetVersion, DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { FileTreeFile } from '@/files/domain/models/FileTreeItem'
import { mountInShadowRoot, unmountQuietly } from '../standalone-shared/shadow-mount'
import { configureSdkAuth } from '../standalone-shared/auth'

import '../../packages/design-system/dist/style.css'
import 'react-toastify/dist/ReactToastify.css'
import './standalone.scss'

interface MountConfig {
  datasetPid: string
  datasetVersionId: string
  fileMetadataVersionId: string | undefined
  fileMetadataPath: string
}

function syntheticVersion(versionId: string): DatasetVersion {
  if (/^\d+\.\d+$/.test(versionId)) {
    const [major, minor] = versionId.split('.').map((n) => Number(n))
    return {
      number: new DatasetVersionNumber(major, minor)
    } as unknown as DatasetVersion
  }
  return {
    number: {
      toString: () => versionId,
      toSearchParam: () => versionId
    } as unknown as DatasetVersionNumber
  } as DatasetVersion
}

function buildFileMetadataUrlFactory(config: MountConfig) {
  return (file: FileTreeFile): string =>
    config.fileMetadataVersionId === undefined
      ? `${config.fileMetadataPath}?fileId=${file.id}`
      : `${config.fileMetadataPath}?fileId=${file.id}&version=${encodeURIComponent(
          config.fileMetadataVersionId
        )}`
}

let mountedHostElement: HTMLElement | null = null
let mountedReactRoot: Root | null = null
let i18nReady: Promise<void> | null = null

async function init(opts: { fromObserver?: boolean } = {}) {
  const config = window.dvTreeViewConfig
  const rootElementId = config?.rootElementId ?? 'dv-tree-view'

  const hostElement = document.getElementById(rootElementId)
  if (!hostElement) {
    return
  }
  if (hostElement === mountedHostElement && mountedReactRoot) {
    return
  }

  if (opts.fromObserver && !config) {
    return
  }

  if (mountedReactRoot) {
    unmountQuietly(mountedReactRoot)
    mountedReactRoot = null
  }

  let reactRoot: HTMLElement
  try {
    reactRoot = mountInShadowRoot({ rootElementId }).reactRoot
  } catch (err) {
    console.error(`[dvTreeView] ${(err as Error).message}`)
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
        <div className="dv-tree-view-root">
          <div className="standalone-error">
            <p>
              dvTreeView: missing required config: <code>{missingFields.join(', ')}</code>
            </p>
            <p>
              Set <code>window.dvTreeViewConfig</code> before loading the script.
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
        <div className="dv-tree-view-root">
          <div className="standalone-error">
            <p>
              dvTreeView: <code>siteUrl</code> must be an absolute http(s) URL.
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
        ns: ['files', 'shared'],
        defaultNS: 'files',
        returnNull: false,
        backend: { loadPath: localesPath }
      })
      .then(() => undefined)
  }
  await i18nReady

  const mountConfig: MountConfig = {
    datasetPid: config.datasetPid,
    datasetVersionId: normaliseVersionId(config.datasetVersionId),
    fileMetadataVersionId: jsfVersionId(config.datasetVersionId),
    fileMetadataPath: new URL(config.fileMetadataPath ?? '/file.xhtml', config.siteUrl).href
  }
  const treeRepository = new FileTreeJSDataverseRepository(new SdkFilePreviewSource())
  const datasetVersion = syntheticVersion(mountConfig.datasetVersionId)
  const buildFileMetadataUrl = buildFileMetadataUrlFactory(mountConfig)
  const downloadFetchInit =
    config.bearerToken !== undefined || config.getBearerToken !== undefined
      ? (): RequestInit | undefined => {
          const token = config.getBearerToken?.() ?? config.bearerToken
          return token ? { headers: { Authorization: `Bearer ${token}` } } : undefined
        }
      : undefined

  root.render(
    <StrictMode>
      <div className="dv-tree-view-root">
        <ToastContainer position="top-right" autoClose={5000} style={{ top: '80px' }} />
        <FilesTree
          treeRepository={treeRepository}
          datasetPersistentId={mountConfig.datasetPid}
          datasetVersion={datasetVersion}
          buildFileMetadataUrl={buildFileMetadataUrl}
          downloadFetchInit={downloadFetchInit}
          buildDownloadUrl={(file) => new URL(file.downloadUrl, config.siteUrl).href}
        />
      </div>
    </StrictMode>
  )
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

function jsfVersionId(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const lower = raw.toLowerCase()
  if (lower === ':draft' || lower === 'draft') return 'DRAFT'
  if (
    lower === ':latest' ||
    lower === 'latest' ||
    lower === ':latest-published' ||
    lower === 'latest-published'
  ) {
    return undefined
  }
  return raw
}

function normaliseVersionId(raw: string | undefined): string {
  if (!raw) return ':latest'
  const lower = raw.toLowerCase()
  if (lower === 'draft') return ':draft'
  if (lower === 'latest') return ':latest'
  if (lower === 'latest-published') return ':latest-published'
  return raw
}

init().catch((error) => {
  console.error('[dvTreeView] init failed:', error)
})

if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(() => {
    const config = window.dvTreeViewConfig
    const rootElementId = config?.rootElementId ?? 'dv-tree-view'
    const current = document.getElementById(rootElementId)
    if (current && current !== mountedHostElement) {
      init({ fromObserver: true }).catch((error) => {
        console.error('[dvTreeView] re-init failed:', error)
      })
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
