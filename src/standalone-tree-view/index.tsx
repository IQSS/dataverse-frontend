import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { ApiConfig, DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript'
import { ToastContainer } from 'react-toastify'
import { FilesTree } from '@/sections/dataset/dataset-files/files-tree/FilesTree'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import { DatasetVersion, DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { FileTreeFile } from '@/files/domain/models/FileTreeItem'
import { mountInShadowRoot } from '../standalone-shared/shadow-mount'

import '../../packages/design-system/dist/style.css'
// Bootstrap 5 base CSS is intentionally NOT imported here. The standalone
// bundle is mounted into pages whose own CSS context (e.g. JSF Bootstrap 3,
// or an external host's stylesheet) we must not perturb. The component's own
// styles are CSS-Modules (hashed class names, no global selectors) and the
// `var(--bs-*)` references in those modules carry inline fallbacks. The
// standalone *demo* HTML page (`dvTreeView.html`) imports Bootstrap directly
// via a <link> tag for its own page chrome.
import 'react-toastify/dist/ReactToastify.css'
import './standalone.scss'

interface MountConfig {
  datasetPid: string
  datasetVersionId: string
  fileMetadataPath: string
}

/**
 * Builds a synthetic DatasetVersion that carries just enough information
 * for FilesTree (the dataset persistent id stays in props; the version
 * is only used to thread a number into requests). The bundle itself
 * does not need the rich SPA Dataset object.
 */
function syntheticVersion(versionId: string): DatasetVersion {
  // FilesTree uses datasetVersion.number.toString() and
  // .toSearchParam(). Both work on DatasetVersionNumber.
  // For a non-numeric tag like ':latest' we route the string through
  // a wrapper that ignores the major/minor split.
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
    `${config.fileMetadataPath}?fileId=${file.id}&version=${encodeURIComponent(
      config.datasetVersionId
    )}`
}

// Module-scope state lets us survive PrimeFaces partial updates that
// re-insert the host `<div id="...">`. The browser does not re-execute
// the already-loaded module script when JSF refreshes the fragment, so
// the FIRST mount goes stale (orphaned root attached to a removed div)
// and subsequent toggles produce an empty tree. We track the last host
// element + Root we mounted, and a MutationObserver re-mounts whenever
// the target id appears as a NEW element in the DOM.
let mountedHostElement: HTMLElement | null = null
let mountedReactRoot: Root | null = null
let i18nReady: Promise<void> | null = null

async function init() {
  const config = window.dvTreeViewConfig
  const rootElementId = config?.rootElementId ?? 'dv-tree-view'

  const hostElement = document.getElementById(rootElementId)
  if (!hostElement) {
    // The host fragment isn't in the DOM right now (e.g. user is on
    // table view). The MutationObserver below will fire init() again
    // when JSF re-inserts the div.
    return
  }
  if (hostElement === mountedHostElement && mountedReactRoot) {
    // Already mounted on this exact element; nothing to do.
    return
  }
  // Host changed (or first mount). Tear down any prior root that's now
  // orphaned, then mount fresh.
  if (mountedReactRoot) {
    try {
      mountedReactRoot.unmount()
    } catch {
      // The previous host element is already gone from the DOM, which
      // makes React throw inside its commit-phase teardown. We're
      // about to drop the reference anyway, so the throw is benign.
    }
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

  ApiConfig.init(`${config.siteUrl}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)

  const localesPath =
    config.localesPath ?? `${config.siteUrl}/dvwebloader/locales/{{lng}}/{{ns}}.json`

  // Initialise i18next exactly once — repeated init() calls log
  // warnings and re-load locale resources unnecessarily. Subsequent
  // mounts (after JSF partial updates) reuse the prior init promise.
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
    fileMetadataPath: config.fileMetadataPath ?? '/file.xhtml'
  }
  const treeRepository = new FileTreeJSDataverseRepository()
  const datasetVersion = syntheticVersion(mountConfig.datasetVersionId)
  const buildFileMetadataUrl = buildFileMetadataUrlFactory(mountConfig)

  root.render(
    <StrictMode>
      <div className="dv-tree-view-root">
        <ToastContainer position="top-right" autoClose={5000} />
        <FilesTree
          treeRepository={treeRepository}
          datasetPersistentId={mountConfig.datasetPid}
          datasetVersion={datasetVersion}
          buildFileMetadataUrl={buildFileMetadataUrl}
        />
      </div>
    </StrictMode>
  )
}

/**
 * Translate the friendly version id JSF passes (`DRAFT`, `1.0`, …) into
 * the wire form the API expects (`:draft`, `:latest`, `1.0`, …).
 *
 * `DatasetPage.workingVersion.friendlyVersionNumber` returns the literal
 * string `"DRAFT"` for unpublished versions. The API uses the
 * colon-prefixed token `:draft` instead — passing `DRAFT` raw produces
 * `[400] Illegal version identifier 'DRAFT'`. We normalise here so JSF
 * doesn't have to translate before populating `window.dvTreeViewConfig`.
 */
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

/**
 * PrimeFaces partial updates can replace the host fragment in the DOM
 * without re-executing this module script. When that happens our
 * already-mounted Root is orphaned (attached to a div that is no
 * longer in the document) and the freshly inserted div sits empty.
 *
 * Observe the document for child-list changes; whenever the
 * configured root element appears (or, more precisely, whenever the
 * element returned by getElementById changes identity) re-run init().
 * The init() guard is itself idempotent for the same host element, so
 * extra observer firings during unrelated DOM updates are cheap
 * no-ops.
 */
if (typeof MutationObserver !== 'undefined' && typeof document !== 'undefined') {
  const observer = new MutationObserver(() => {
    const config = window.dvTreeViewConfig
    const rootElementId = config?.rootElementId ?? 'dv-tree-view'
    const current = document.getElementById(rootElementId)
    if (current && current !== mountedHostElement) {
      init().catch((error) => {
        console.error('[dvTreeView] re-init failed:', error)
      })
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
