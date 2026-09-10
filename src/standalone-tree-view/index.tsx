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
  /** API-normalised form (`:draft`, `:latest`, `1.2`) for SDK requests. */
  datasetVersionId: string
  /**
   * The version value for `file.xhtml` links, kept in the JSF-friendly
   * form the host page provided (`DRAFT`, `1.2`). JSF's version lookup
   * does not understand the API's `:draft`/`:latest` tokens — a `:draft`
   * link on a published dataset silently opens the released version.
   * `undefined` means "omit &version=" and let file.xhtml pick its
   * default (latest released).
   */
  fileMetadataVersionId: string | undefined
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
    config.fileMetadataVersionId === undefined
      ? `${config.fileMetadataPath}?fileId=${file.id}`
      : `${config.fileMetadataPath}?fileId=${file.id}&version=${encodeURIComponent(
          config.fileMetadataVersionId
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

  // Config-not-yet-available short-circuit. When init() runs from the
  // MutationObserver after a JSF partial update inserts a fresh host
  // div, the inline `<script>` that assigns `window.dvTreeViewConfig`
  // may not have executed YET in the same observer callback —
  // PrimeFaces fires DOM mutations and inline-script execution in
  // separate phases. Without this guard we'd render the "missing
  // config" error UI into the host div, then the next observer tick
  // would no-op because the host element identity is unchanged.
  // Returning silently lets the next mutation (e.g. when the JSF
  // partial-update fragment finishes inserting itself) re-trigger
  // init() with the config now populated.
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

  // Validate `siteUrl` before threading it into the SDK. The host JSF
  // page sets this from a server-side EL expression, but defending
  // against a typo'd or attacker-controlled config is cheap: insist on
  // an http(s) absolute URL. Anything else (`javascript:`, file paths,
  // mismatched origins) gets rejected with a visible error rather than
  // silently misdirecting every API call (with the user's session
  // cookie in tow).
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
 * Reject anything that is not a syntactically-valid absolute http(s)
 * URL. The host page is normally trusted (server-rendered config), but
 * a typo or an attacker-controlled config field would otherwise route
 * every SDK call to whatever the misconfigured value points to —
 * carrying the user's session cookie. Cheap defence-in-depth.
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
 * Translate the friendly version id JSF passes (`DRAFT`, `1.0`, …) into
 * the wire form the API expects (`:draft`, `:latest`, `1.0`, …).
 *
 * `DatasetPage.workingVersion.friendlyVersionNumber` returns the literal
 * string `"DRAFT"` for unpublished versions. The API uses the
 * colon-prefixed token `:draft` instead — passing `DRAFT` raw produces
 * `[400] Illegal version identifier 'DRAFT'`. We normalise here so JSF
 * doesn't have to translate before populating `window.dvTreeViewConfig`.
 */
/**
 * The JSF-friendly counterpart of `normaliseVersionId`: the host may
 * legitimately pass API tokens (`:draft`, `:latest`, …) per the config
 * docs, but `file.xhtml` only understands `DRAFT` or a numeric version
 * — an unrecognised value silently resolves to the first released
 * version. Draft tokens map to `DRAFT`; latest tokens map to
 * `undefined` so the link omits `&version=` and file.xhtml applies its
 * own latest-released default; numeric versions pass through.
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
      init({ fromObserver: true }).catch((error) => {
        console.error('[dvTreeView] re-init failed:', error)
      })
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
