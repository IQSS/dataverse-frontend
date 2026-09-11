import { createRoot, Root } from 'react-dom/client'
import { StrictMode } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { ToastContainer } from 'react-toastify'
import { FilesTree } from '@/sections/dataset/dataset-files/files-tree/FilesTree'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import { FileJSDataverseRepository } from '@/files/infrastructure/FileJSDataverseRepository'
import { DatasetVersion, DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { FileTreeFile } from '@/files/domain/models/FileTreeItem'
import { mountInShadowRoot } from '../standalone-shared/shadow-mount'
import { configureSdkAuth } from '../standalone-shared/auth'

import '../../packages/design-system/dist/style.css'
// No Bootstrap base CSS: the host page owns the global cascade. Component
// styles are CSS Modules with inline fallbacks for every `var(--bs-*)`.
import 'react-toastify/dist/ReactToastify.css'
import './standalone.scss'

interface MountConfig {
  datasetPid: string
  /** API-normalised form (`:draft`, `:latest`, `1.2`) for SDK requests. */
  datasetVersionId: string
  /**
   * JSF form for `file.xhtml` links (`DRAFT`, `1.2`); `undefined` omits
   * `&version=`. See `jsfVersionId`.
   */
  fileMetadataVersionId: string | undefined
  fileMetadataPath: string
}

/** Just enough DatasetVersion for FilesTree to thread a version number into requests. */
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
    config.fileMetadataVersionId === undefined
      ? `${config.fileMetadataPath}?fileId=${file.id}`
      : `${config.fileMetadataPath}?fileId=${file.id}&version=${encodeURIComponent(
          config.fileMetadataVersionId
        )}`
}

// PrimeFaces partial updates re-insert the host `<div>` without re-running
// this module, which orphans the first React root. We remember what we
// mounted, and the MutationObserver at the bottom re-runs init() whenever
// the host element's identity changes. init() is idempotent per element.
let mountedHostElement: HTMLElement | null = null
let mountedReactRoot: Root | null = null
let i18nReady: Promise<void> | null = null

async function init(opts: { fromObserver?: boolean } = {}) {
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

  // From the observer, the fresh host div can land before the inline
  // config script has run. Bail silently and let the next mutation retry;
  // rendering the "missing config" error here would pin it, because the
  // element identity would then be unchanged.
  if (opts.fromObserver && !config) {
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

  // These two config errors stay in English on purpose, and render before
  // i18n is initialised.
  //
  // They report that the embedding page is misconfigured, so the reader is
  // whoever wrote that page, not the end user. Translating them would also
  // mean initialising i18n first, which we cannot do here: the locale files
  // are fetched relative to this bundle, and a deployment broken enough to
  // pass a bad config is exactly the one where that fetch 404s. We would
  // trade a readable English sentence for a hang or a raw i18n key.
  //
  // Validating `siteUrl` before it reaches the SDK is the other reason for
  // the ordering: i18n init must not run against an unvalidated origin.
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

  // See isValidSiteUrl for why this is rejected loudly rather than passed on.
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

  // Translations live next to this bundle, wherever an operator deployed it —
  // behind their web server or in a WAR. Deriving the path from the bundle's
  // own URL keeps it correct for any base URL without the host page having to
  // know or pass one. `import.meta.url` must be read here, in the entry
  // module: from a shared chunk it would resolve to `chunks/` instead.
  const localesPath =
    config.localesPath ??
    `${new URL(/* @vite-ignore */ './locales/', import.meta.url).href}{{lng}}/{{ns}}.json`

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
    fileMetadataVersionId: jsfVersionId(config.datasetVersionId),
    fileMetadataPath: config.fileMetadataPath ?? '/file.xhtml'
  }
  // Passing a FileRepository is what enables the fallback inside
  // FileTreeJSDataverseRepository: on an instance whose backend predates the
  // /tree endpoint it rebuilds the tree from file previews instead of failing.
  // The bundle is deployed and versioned separately from the backend, so it
  // will routinely meet servers older than itself.
  const treeRepository = new FileTreeJSDataverseRepository(new FileJSDataverseRepository())
  const datasetVersion = syntheticVersion(mountConfig.datasetVersionId)
  const buildFileMetadataUrl = buildFileMetadataUrlFactory(mountConfig)
  // The zip engine fetches downloadUrl outside the SDK, so a
  // bearer-token embed must repeat its Authorization header there —
  // session-cookie embeds need nothing (same-origin cookies ride along).
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
        {/*
          The toast container is fixed-positioned against the viewport
          (even when rendered inside a Shadow DOM). On JSF pages the
          dataset header / nav bar sits at the top of the viewport and
          partially covers the default `top: 1em` toast slot. Offsetting
          to ~80px clears the typical Dataverse header without going so
          far down that toasts feel detached from the page.
        */}
        <ToastContainer position="top-right" autoClose={5000} style={{ top: '80px' }} />
        <FilesTree
          treeRepository={treeRepository}
          datasetPersistentId={mountConfig.datasetPid}
          datasetVersion={datasetVersion}
          buildFileMetadataUrl={buildFileMetadataUrl}
          downloadFetchInit={downloadFetchInit}
        />
      </div>
    </StrictMode>
  )
}

/**
 * Only an absolute http(s) URL may reach the SDK: a typo'd or injected
 * `siteUrl` would otherwise route every API call, session cookie included,
 * wherever it points.
 */
function isValidSiteUrl(raw: string | undefined): boolean {
  if (!raw) return false
  try {
    const u = new URL(raw)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Inverse of `normaliseVersionId` for `file.xhtml` links, which understand
 * `DRAFT` or a number but not API tokens: draft tokens become `DRAFT`,
 * latest tokens become `undefined` (omit `&version=`), numbers pass through.
 */
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

/**
 * JSF passes `friendlyVersionNumber` (`DRAFT`, `1.0`); the API wants
 * `:draft`/`:latest`/`1.0`. Raw `DRAFT` is a 400.
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

// Re-mount after PrimeFaces partial updates; see the module-scope state above.
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
