# Reusable Components

How to build, ship, and consume Dataverse frontend components that work in **both** the React SPA and the legacy JSF UI.

This document is the **frontend** half of the contract. The matching backend half — JSF feature flags, JSF mount points, and operator setup — is documented in the Dataverse operator guide: [Reusable Frontend Components](https://guides.dataverse.org/en/latest/container/running/reusable-components.html). Read both before changing the contract.

- [Why dual-mode](#why-dual-mode)
- [The contract](#the-contract)
- [Build pipeline](#build-pipeline)
- [Authentication](#authentication)
- [CSS isolation](#css-isolation)
- [Adding a new reusable component](#adding-a-new-reusable-component)
- [Making an existing SPA component reusable](#making-an-existing-spa-component-reusable)
- [Currently shipped components](#currently-shipped-components)
- [Testing reusable components](#testing-reusable-components)
- [Versioning and breaking changes](#versioning-and-breaking-changes)

## Why dual-mode

Dataverse is multi-year migrating from JSF to a React SPA. Some pages are SPA, many are still JSF, and a few are mixed. We don't want two implementations of the same feature; we want one React component that runs in both places. The pattern:

```
┌─────────────────────────────────────────────────────────────┐
│           One React component (built once)                  │
│                                                             │
│   Mounts via window.<Component>Config in JSF (direct mount) │
│   Mounts via React props in the SPA (no config object)      │
└─────────────────────────────────────────────────────────────┘
```

The bundle is loaded as a regular `<script type="module">` in JSF and as a normal SPA section in React. No iframes; no postMessage glue.

## The contract

Every reusable component **MUST**:

1. Have a **standalone entry** under `src/standalone-<component>/index.tsx` that:
   - Reads its config from a typed window global, e.g. `window.dvUploaderConfig`.
   - Mounts a React tree on a DOM node with a configurable id (default e.g. `dv-uploader`).
   - Renders an inline error if the config is missing or invalid — JSF callers cannot see thrown exceptions.
2. Have a **typed config interface** (`config.ts`) with `siteUrl` (mandatory) and a small set of explicit fields. Optional fields go after required ones.
3. Have a **shared core React component** under `src/sections/shared/<component>/<Component>Core.tsx` that the SPA and the standalone wrapper both render. The core takes **props**, not config.
4. Provide a **dedicated repository adapter** (`Standalone<Component>Repository.ts`) when the SPA repository is not directly usable, so the standalone path stays loosely coupled to SPA-specific contexts.
5. Accept **either a bearer token (in any host) or a JSESSIONID session cookie (same-origin JSF shortcut)** — the host picks. See [Authentication](#authentication).
6. Inject its CSS via [`vite-plugin-css-injected-by-js`](https://www.npmjs.com/package/vite-plugin-css-injected-by-js) so the artifact is a single JS file. See [CSS isolation](#css-isolation).
7. Expose a **stable mount config** that doesn't depend on internal route state, design tokens, or the SPA's redux/context graph. The config is the public API surface; treat it like one.

The host page, in turn, **MUST**:

1. Set `window.<componentConfig>` synchronously **before** loading the bundle.
2. Provide the mount target `<div id="...">`.
3. Either pass a `bearerToken` / `getBearerToken` in the config (recommended for any host you control end-to-end, mandatory for cross-origin embeds) **or** set `dataverse.siteUrl` (server-side) to the URL the browser actually uses, so Origin/Referer matches and session-cookie auth works (same-origin JSF shortcut).

## Build pipeline

Reusable components are built by `vite.config.reusable-components.ts`. The output goes to `dist-reusable-components/reusable-components/`. The inner directory is the unit of deployment: copied into a web server's docroot it is served at `/reusable-components/`, and `deployment/reusable-components/pom.xml` wraps the same directory as `reusable-components.war` for Payara. The bundles are not shipped in the Dataverse WAR; see the Installation Guide's "Reusable Frontend Components" page for the operator side.

```
dist-reusable-components/
└── reusable-components/
    ├── dv-tree-view.js                  # entry per component
    ├── dv-uploader.js
    ├── chunks/
    │   ├── react-<hash>.js              # React + ReactDOM + scheduler
    │   ├── i18n-<hash>.js               # i18next + react-i18next + http-backend
    │   ├── vendor-<hash>.js             # other npm deps
    │   ├── dataverse-shared-<hash>.js   # shared SPA code (files, dataset, design-system)
    │   └── auth-<hash>.js               # standalone-shared auth (SDK init)
    └── locales/                         # en/, es/ … JSON the bundles fetch at runtime
```

The shared chunks (`react`, `i18n`, `vendor`, `dataverse-shared`, plus small auto-split ones like `auth`) are produced by the `manualChunks` rule in `vite.config.reusable-components.ts` and Rollup's own splitting. When you add a second component, both bundles share these chunks; the host page loads each shared chunk **once** even if it embeds multiple components.

To add a new component to the build, add another entry under `rollupOptions.input`:

```ts
input: {
  'dv-uploader': path.resolve(__dirname, 'src/standalone-uploader/index.tsx'),
  'dv-tree-view': path.resolve(__dirname, 'src/standalone-tree-view/index.tsx')
}
```

Build with:

```bash
npm run build-reusable-components
```

The `generate-reusable-components-war` workflow runs the same build, packages the WAR, and attaches it to the GitHub release when triggered by one. Unlike the SPA's `generate-war`, the output is not tied to an environment: the components take all configuration from the host page at runtime, so one WAR serves every installation.

## Authentication

The bundle ships **two contracts**, and the host picks one per mount. Both go through `@iqss/dataverse-client-javascript` — the bundle never builds its own headers.

### Bearer token (works in any host page)

The general path. The host provides a token in the config; the SDK attaches `Authorization: Bearer <token>` to every API request. Works regardless of origin (no cookies in flight), works on any HTML page, works in a third-party SaaS embed, works in the standalone demo. **How the host obtains the token is out of scope** — could be the host's own OIDC flow, an opaque token vended by a session-exchange endpoint, a CI-issued service token, anything. The bundle stays oblivious.

Two shapes:

```ts
// Static — the host already has a token at mount time and it doesn't refresh.
window.dvUploaderConfig = {
  siteUrl: 'https://your-dataverse.edu',
  datasetPid: 'doi:10.5072/FK2/XXXXX',
  bearerToken: '<jwt>'
}
```

```ts
// Per-request getter — the host wants to rotate the token without
// remounting (e.g. silent refresh from an OIDC library). Consulted on
// every API call. Return null/undefined to fall through to the static
// bearerToken, or to session-cookie if neither is set.
window.dvUploaderConfig = {
  siteUrl: 'https://your-dataverse.edu',
  datasetPid: 'doi:10.5072/FK2/XXXXX',
  getBearerToken: () => oidcClient.getAccessTokenIfValid()
}
```

If both `bearerToken` and `getBearerToken` are set, the function wins.

### Session cookie (same-origin JSF shortcut)

Omit `bearerToken` _and_ `getBearerToken`, and the bundle falls back to sending the browser's JSESSIONID via `withCredentials: true`. This is the zero-config path for JSF pages on the same origin: the user is already logged into JSF, the cookie already exists, the SDK just attaches it. Picks up CSRF hardening automatically (`GET /api/users/:csrf-token` on bootstrap, `X-Dataverse-CSRF-Token` on every write).

Prerequisites on the Dataverse instance when you use this path:

- `DATAVERSE_FEATURE_API_SESSION_AUTH=1` (`dataverse.feature.api-session-auth`). Required and enforced.
- `DATAVERSE_FEATURE_API_SESSION_AUTH_HARDENING=1` (`dataverse.feature.api-session-auth-hardening`). Recommended for production. Adds Origin/Referer + `X-Dataverse-CSRF-Token` enforcement on every session-cookie API request. Delivered by [`IQSS/dataverse#12188`](https://github.com/IQSS/dataverse/pull/12188).
- `dataverse.siteUrl=<browser-facing URL>`. Used for Origin/Referer validation when hardening is on.

Cookies don't travel cross-origin, so this path only works when the bundle is loaded by a page on the **same origin** as `siteUrl`. Cross-origin / non-JSF / third-party hosts MUST use the bearer path.

### Picking one

| Where is the bundle mounted?                     | Use                                                                  |
| ------------------------------------------------ | -------------------------------------------------------------------- |
| JSF page, same origin as Dataverse API           | Session cookie (or bearer if you have one — either works)            |
| SPA on the same Dataverse install                | Bearer (the SPA already has a token from its OIDC login)             |
| Third-party HTML page, your own org              | Bearer (whatever your auth flow produces)                            |
| Third-party HTML page, partner integration       | Bearer (your contract with the partner says how the token is issued) |
| Cross-origin embed (different host than the API) | Bearer (cookies don't cross origins)                                 |
| Standalone demo / local testing                  | Bearer (pass `?bearerToken=…` in the URL)                            |

The wiring in each component's `index.tsx` is one helper call:

```ts
import { configureSdkAuth } from '../standalone-shared/auth'

configureSdkAuth(config.siteUrl, {
  bearerToken: config.bearerToken,
  getBearerToken: config.getBearerToken
})
```

`configureSdkAuth` picks BEARER_TOKEN if either field is set, SESSION_COOKIE otherwise. New components inherit the contract by using the same helper — don't reimplement.

## CSS isolation

Standalone bundles are mounted into Shadow DOM. The mounting helper lives at `src/standalone-shared/shadow-mount.ts` and is used by every standalone wrapper:

```ts
import { mountInShadowRoot } from '../standalone-shared/shadow-mount'

const { reactRoot } = mountInShadowRoot({ rootElementId: 'dv-tree-view' })
createRoot(reactRoot).render(/* … your React tree … */)
```

**What Shadow DOM gives us, and what it doesn't.**

- Both directions are isolated. The host JSF/Bootstrap-3 stylesheet does **not** cascade into the bundle — `input { display: inline-block }` from PrimeFaces no longer overrides `<input hidden>`, and the host's `body { font-size: 14px }` does not override the component's typography. Symmetrically, the bundle's Bootstrap-5 reset / design-system tokens do **not** leak into the host's `<head>` and clobber the JSF page chrome.
- The exception: anything that reaches outside the React tree via a portal. `react-toastify`'s `<ToastContainer>` renders inline in the React tree, so it stays inside the shadow root automatically. Anything that defaults to `document.body` (modal libraries, `react-bootstrap` `<Overlay>` / `<Tooltip>` / `<Popover>`, popperjs containers) **must** be passed an explicit container that lives inside the shadow root. The shadow root is exposed as `window.__dvShadowRoot[rootElementId]` for that purpose; importing it from `shadow-mount.ts` is preferred.
- The momentary `document.body.appendChild(<a>)` anchor-click trick used for browser-triggered downloads is unaffected — it's browser-level navigation, not styling.

**How the CSS reaches the shadow root.** `vite-plugin-css-injected-by-js` is configured with a custom `injectCode` (see `vite.config.reusable-components.ts`) that pushes every CSS chunk onto `window.__dvPendingStyles` instead of appending it to `<head>`. The shadow-mount helper drains that queue, creating one `<style>` element inside the shadow root per chunk. Each entry bundle carries the full CSS for self-sufficient mounting (controlled by `jsAssetsFilterFunction`); on a page that loads only `dv-uploader.js` the CSS is still adopted, on a page that loads only `dv-tree-view.js` the same.

**Cookbook for adding a new reusable component:**

1. Wrap the React tree in `<div className="dv-<component>-root">` (the className is for tests / inspector clarity only — not for isolation).
2. Use **CSS Modules** for component styles. Hashed class names guarantee no collisions even outside the shadow root.
3. Page-level styling (background, fonts, viewport-fill) lives in a `standalone-page.scss` that is **only** loaded by the standalone demo HTML via `<link rel="stylesheet">` — not by the bundle. The bundle is for embeds; the demo page chrome is for the demo page.
4. Don't import `bootstrap/dist/css/bootstrap.min.css` from the standalone wrapper. The shadow root carries the design-system stylesheet (CSS-Modules + tokens) which is enough for the component to render correctly. Importing global Bootstrap here is the historical bug that motivated this whole section.
5. If your component uses a portal-based library (modal, popover, tooltip), pass `portalContainer={shadow}` (or the equivalent) — get the shadow ref via the second return value of `mountInShadowRoot`. Never let a portal default to `document.body`.
6. **Hardcode color fallbacks for any `var(--bs-*)` references in component CSS.** The shadow root inherits CSS custom properties from the host page. JSF pages use Bootstrap-3 (or no Bootstrap at all) and don't define the Bootstrap-5 token set the component expects, so `border: 1px solid var(--bs-border-color)` resolves to `1px solid` (invalid → invisible). Always provide a fallback: `var(--bs-border-color, #c4c8cc)`.

## Surviving JSF partial updates

The standalone bundles are loaded as ES modules from JSF pages. PrimeFaces partial updates can re-insert the host `<div>` in the DOM without re-executing the already-loaded module script — which leaves the React Root attached to a div that is no longer in the document, and the new div sits empty. The fix lives in each standalone wrapper:

```ts
let mountedHostElement: HTMLElement | null = null
let mountedReactRoot: Root | null = null

async function init() {
  const hostElement = document.getElementById(rootElementId)
  if (!hostElement) return
  if (hostElement === mountedHostElement && mountedReactRoot) return
  if (mountedReactRoot) {
    try {
      mountedReactRoot.unmount()
    } catch {
      /* old div already gone */
    }
  }
  // … build a fresh root, render …
  mountedHostElement = hostElement
  mountedReactRoot = root
}

if (typeof MutationObserver !== 'undefined') {
  const observer = new MutationObserver(() => {
    const current = document.getElementById(rootElementId)
    if (current && current !== mountedHostElement) {
      void init()
    }
  })
  observer.observe(document.body, { childList: true, subtree: true })
}
```

The MutationObserver fires whenever the document tree changes; the cheap identity check (`current !== mountedHostElement`) makes unrelated DOM updates a no-op. Init() is itself idempotent for the same host element.

`i18next.init()` and `ApiConfig.init()` should each only run once across remounts — guard them with module-scope flags. See `src/standalone-tree-view/index.tsx` and `src/standalone-uploader/index.tsx` for the canonical pattern.

## Calling Dataverse APIs from the bundle

The component's `fetch` calls are subject to browser CORS rules. Two pitfalls worth knowing:

- **`credentials: 'include'` and S3 redirects.** Dataverse's download API often returns a 302 to a presigned S3 URL when storage has `download-redirect=true`. Browsers carry the credentials mode through the redirect, and an S3 response with `Allow-Origin: *` plus a request that says "include credentials" is rejected by the browser. Use `credentials: 'same-origin'` so cookies travel only on same-origin Dataverse calls and are dropped on the cross-origin S3 hop.
- **No `Authorization` header on presigned URLs.** A bearer-token embed sends `Authorization: Bearer …` to the Dataverse access endpoint, but the chunked zip download fetches Range parts 2..N from the presigned S3 URL that the first response redirected to. S3 rejects a request that carries both query-string signing and an `Authorization` header, and the header would also force a CORS preflight the bucket may not answer. `initForUrl` in `useStreamingZipDownload.ts` strips the header whenever the target origin differs from the original Dataverse URL; the tests around it exist to keep that behaviour from being "simplified" away.
- **Re-presign on 403.** Presigned URLs expire, and a large file can outlive the one its first chunk was fetched with. When a later Range part gets a 403, the engine refetches the Dataverse access endpoint with `gbrecs=true` (so the download is not counted in the guestbook a second time), follows the new redirect, and continues from the fresh URL. Any other status propagates and pauses the zip through the normal retry/skip flow.
- **Presigned-URL host signing.** S3 enforces that the request `Host` header matches what was signed. In docker-compose dev, Dataverse signs URLs against the docker-internal hostname (`localstack:4566`); the browser must reach the same hostname for the signature to verify. The standard fix is to add `127.0.0.1 localstack` to the developer's `/etc/hosts`. This is a property of presigned-URL networking, not a Dataverse bug.

## Adding a new reusable component

Greenfield component (no existing SPA section to reuse):

1. **Design the contract first.** What does the host pass in? What events does the host need? Write the `config.ts` interface before writing any UI.
2. **Build the SPA section first.** Put the React tree under `src/sections/<area>/<feature>/`. Use the standard DDD layout (`src/<area>/domain/...`, `src/<area>/infrastructure/...`). It must run in the SPA before the JSF mount path is touched.
3. **Extract a `Core` component.** Pull the props-driven inner React tree out into `<Component>Core.tsx`. The SPA section keeps its routing/context glue; the core takes pure props.
4. **Add a standalone wrapper.** Create `src/standalone-<component>/index.tsx`, `config.ts`, `Standalone<Component>Repository.ts` (if needed). Wrap the core in a thin component that reads `window.<componentConfig>`, sets up `ApiConfig`, mounts on the configured div.
5. **Add a vite entry.** Append to `rollupOptions.input` in `vite.config.reusable-components.ts`.
6. **Add a demo HTML.** `src/standalone-<component>/<componentName>.html` with a one-page demo, including a snippet showing JSF integration.
7. **Document.** Update [Currently shipped components](#currently-shipped-components) and add a brief contract description.

## Making an existing SPA component reusable

Start by re-using an existing SPA section:

1. **Identify the smallest props-driven sub-tree.** Pull it out as `<Component>Core` if it isn't already. The core must not call `useNavigate`, `useSearchParams`, or any SPA-only hook. Move that to the wrapper.
2. **Externalise the repository.** Replace any `useRepository()` / shared-context hook with explicit props or a repository adapter.
3. **Replace router-driven side effects with callbacks — but keep `navigate()` colocated with its gate.** `onSubmit` / `onCancel` / `onDownload` come from the standalone wrapper's `config`; the SPA wrapper provides router-driven defaults. **Do not** put `navigate()` (or `window.location.href`) inside a callback that the shared core invokes from a `useEffect` if the wrapper owns a blocking gate like `useBlocker` or a `beforeunload` listener. React fires child effects _before_ parent effects, so the navigate would consult the router/window with the parent's _previous_ gate state. Instead, have each wrapper observe the same context state (e.g. an `addFilesToDatasetOperationInfo.success` flag) and trigger its own navigation effect, registered after the gate setup, in the same component as the gate. The shared core should only emit transient feedback (toasts, status updates) — not navigation. We hit exactly this race when first splitting the file uploader for the standalone bundle; the writeup is in `CHANGELOG.md` under "Successful Save in the SPA file uploader…".
4. **Keep i18n.** Shared core uses `react-i18next` exactly as in the SPA; the standalone bundle initialises i18n from `config.locale`/`config.localesPath` (default: `locales/{{lng}}/{{ns}}.json` resolved against the bundle's own `import.meta.url`, so it follows the bundle wherever it is deployed).
5. **Wire it.** Follow steps 4-7 of [Adding a new reusable component](#adding-a-new-reusable-component).

A useful diff to study: `src/standalone-uploader/` next to `src/sections/shared/file-uploader/FileUploaderPanelCore.tsx`. The SPA `FileUploaderPanel` and the standalone `StandaloneFileUploaderPanel` both render `FileUploaderPanelCore`.

## Currently shipped components

### `dv-uploader` — File uploader

Replaces the PrimeFaces `p:fileUpload` upload widget on JSF dataset edit pages.

Config:

```ts
interface DvUploaderConfig {
  siteUrl: string // required
  datasetPid: string // required
  locale?: string // default 'en'
  localesPath?: string // default: `locales/{{lng}}/{{ns}}.json` relative to the bundle URL
  rootElementId?: string // default 'dv-uploader'
}
```

JSF integration:

```html
<div id="dv-uploader"></div>
<script>
  window.dvUploaderConfig = {
    siteUrl: '#{settingsWrapper.dataverseSiteUrl}',
    datasetPid: '#{DatasetPage.dataset.globalId.asString()}',
    locale: '#{dataverseLocaleBean.locale}'
  }
</script>
<script type="module" src="/reusable-components/dv-uploader.js"></script>
```

Feature flag (server-side): `dataverse.feature.react-uploader`.

### Tree view (`#6691`)

Built on the same pattern. The SPA section lives at `src/sections/dataset/dataset-files/files-tree/`; the standalone wrapper is in `src/standalone-tree-view/` and is the second entry point in `vite.config.reusable-components.ts` (`dv-tree-view`). The bundle config interface is `window.dvTreeViewConfig` (see [`src/standalone-tree-view/config.ts`](../src/standalone-tree-view/config.ts)).

Feature flag (server-side): `dataverse.feature.react-tree-view`.

The tree view ships:

- Lazy folder loading with an opaque keyset cursor.
- Path-keyed tri-state selection (folders without descendant enumeration; logical until download time).
- Visible-row virtualisation; no `react-virtual` / `react-window` dep.
- Full WAI-ARIA tree keyboard navigation (`ArrowUp/Down/Left/Right`, `Home/End`, `Space`, `Enter`).
- URL bookmarkability: `?view=tree&path=<folder>` round-trips and pre-fetches every ancestor on mount.
- **Client-side streaming-zip download.** Multi-file selections are zipped in the browser via [`client-zip`](https://github.com/Touffy/client-zip) (~3 KB gzip, the only new dep introduced by the tree). A centred tray (`FilesTreeDownloadTray`) shows progress, the file currently being added, and surfaces an inline **Retry / Skip / Skip & retry at end / Skip all** decision row when a fetch fails. _Skip & retry at end_ converts the run into a two-pass flow mid-flight (failures accumulate as recoverable, then the tray prompts to retry them at the end). _Skip all_ switches to skip-with-manifest and writes a `manifest.txt` listing the failures into the root of the zip. Every download from the tree, a single file included, goes through the engine so it gets the same Range-part resilience and progress. **No server contract changes.** Per-file fetches use `credentials: 'same-origin'` (not `'include'`) so the browser drops cookies on the cross-origin S3 hop after a `download-redirect=true` 302 — including credentials there would force `Access-Control-Allow-Credentials: true` on every S3 response and break against `Allow-Origin: *` rules.
- **Header select-all checkbox.** Tristate (none / partial / all). Selects every top-level item when nothing is selected, clears everything otherwise.

## Testing reusable components

- **SPA tests run as Cypress component tests** under `tests/component/...`, using `cy.customMount` so the React tree gets the same `Router`, `I18nextProvider`, `ThemeProvider`, and `ExternalToolsProvider` it would in production.
- **Standalone wrapper tests** mount the standalone component with a stubbed `window.<componentConfig>`. Verify the inline error path (config missing) explicitly — JSF callers cannot see thrown exceptions.
- **Unit-test transformers and config parsers** in plain TypeScript files under `tests/component/<component>/...spec.ts`. No Cypress for pure-TS code.
- **Storybook** stories may be added for components that benefit from visual review. Not required.
- **Coverage threshold** is 95% on `src/sections/**/*.{ts,tsx}` (`.nycrc.json`). Reusable components count.

### Testing the JSF embed locally

The dev environment can serve the built components next to the JSF pages, the same way a production proxy would. It needs a valid `.npmrc` (see the Developer Guide; the SPA container runs `npm install` against GitHub Packages) and a Dataverse image that has the tree endpoint and the feature flags. Every push to the backend PR publishes one as `ghcr.io/gdcc/dataverse:<branch>`.

```bash
npm run build-reusable-components
cd dev-env
REGISTRY=ghcr.io DATAVERSE_IMAGE_TAG=6691-reusable-components \
  docker compose -f docker-compose-dev.yml -f reusable-components/docker-compose.override.yml up -d --build
```

The override turns on `api-session-auth`, `react-tree-view` and `react-uploader`, points `dataverse.reusable-components.base-url` at `/reusable-components`, sets the site URL to the nginx origin so the components call the API same-origin, and mounts `dist-reusable-components/reusable-components` into nginx at that path. Then:

- `http://localhost:8000/dataset.xhtml?persistentId=…` — JSF dataset page with the React tree on the Files tab, and the React uploader under Edit → Files.
- `http://localhost:8000/modern` — the SPA, same origin.

Rebuild the components with `npm run build-reusable-components` and reload; nginx serves the new files directly. After restarting the Dataverse container run `docker exec dev_nginx_proxy nginx -s reload`, since nginx resolves the upstream address once at startup. A locally built backend works too: `mvn -Pct clean package docker:build` in the dataverse checkout produces `gdcc/dataverse:unstable`, which the default `REGISTRY=docker.io` and `DATAVERSE_IMAGE_TAG=unstable` pick up without a pull.

When in doubt about a test, look at:

- `tests/component/sections/shared/file-uploader/FileUploaderPanelCore.spec.tsx`
- `tests/component/sections/dataset/dataset-files/files-tree/FilesTree.spec.tsx`

## Versioning and breaking changes

The reusable bundle is consumed cross-repo:

- The SPA and the standalone bundle move together (same git tag).
- Dataverse's `reusable-components` directory is **served from the SPA build output**. There is no separate package version on the JSF side beyond the file path it loads.
- A breaking change to a config interface is a coordinated change across `dataverse-frontend` and `dataverse` (the JSF page that sets `window.<componentConfig>`).

Rules of thumb:

- **Add fields**, never remove. The host might be on an older JSF page.
- **Default to no-op** when a config field is unrecognised. Don't throw; log a `console.warn`.
- **Bump the file name (`dv-uploader.v2.js`) only on truly breaking changes** — a renamed config field, a removed mount path. Otherwise you fork the integration permanently.
- **Document the new shape in this file** and in the matching backend doc on the same PR. Reviewers should see both halves.
