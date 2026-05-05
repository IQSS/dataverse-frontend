# Reusable Components

How to build, ship, and consume Dataverse frontend components that work in **both** the React SPA and the legacy JSF UI.

This document is the **frontend** half of the contract. The matching backend half — JSF feature flags, JSF mount points, nginx hosting — lives in [`dataverse/doc/Architecture/reusable_frontend_components.md`](https://github.com/IQSS/dataverse/blob/develop/doc/Architecture/reusable_frontend_components.md). Read both before changing the contract.

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
2. Have a **typed config interface** (`config.ts`) with `siteUrl` (mandatory) and a small set of explicit fields. No URL params; no API tokens. Optional fields go after required ones.
3. Have a **shared core React component** under `src/sections/shared/<component>/<Component>Core.tsx` that the SPA and the standalone wrapper both render. The core takes **props**, not config.
4. Provide a **dedicated repository adapter** (`Standalone<Component>Repository.ts`) when the SPA repository is not directly usable, so the standalone path stays loosely coupled to SPA-specific contexts.
5. Authenticate via **session cookie (JSESSIONID)** only. See [Authentication](#authentication).
6. Inject its CSS via [`vite-plugin-css-injected-by-js`](https://www.npmjs.com/package/vite-plugin-css-injected-by-js) so the artifact is a single JS file. See [CSS isolation](#css-isolation).
7. Expose a **stable mount config** that doesn't depend on internal route state, design tokens, or the SPA's redux/context graph. The config is the public API surface; treat it like one.

The host page, in turn, **MUST**:

1. Set `window.<componentConfig>` synchronously **before** loading the bundle.
2. Provide the mount target `<div id="...">`.
3. Set `dataverse.siteUrl` (server-side) to the URL the browser actually uses, so Origin/Referer matches and session-cookie auth works.

## Build pipeline

Reusable components are built by `vite.config.uploader.ts` (poorly named — it builds _all_ reusable components, not just the uploader). The output goes to `dist-uploader/reusable-components/`:

```
dist-uploader/
└── reusable-components/
    ├── dv-uploader.js                   # entry per component
    ├── chunks/
    │   ├── react-<hash>.js              # React + ReactDOM + scheduler
    │   ├── i18n-<hash>.js               # i18next + react-i18next + http-backend
    │   ├── vendor-<hash>.js             # other npm deps
    │   └── dataverse-shared-<hash>.js   # shared SPA code (files, dataset, design-system)
    └── assets/                          # fonts/images if any
```

The four shared chunks (`react`, `i18n`, `vendor`, `dataverse-shared`) are produced by the `manualChunks` rule in `vite.config.uploader.ts`. When you add a second component, both bundles share these chunks; the host page loads each shared chunk **once** even if it embeds multiple components.

To add a new component to the build, add another entry under `rollupOptions.input`:

```ts
input: {
  'dv-uploader': path.resolve(__dirname, 'src/standalone-uploader/index.tsx'),
  'dv-tree-view': path.resolve(__dirname, 'src/standalone-tree-view/index.tsx')
}
```

Build with:

```bash
npm run build-uploader
```

(Yes, also poorly named — it builds the whole reusable-components folder.)

## Authentication

**Session cookie only.** API key in URL is not accepted. Bearer auth is for SPA developer flows; reusable components in JSF land authenticate via the user's existing session.

Prerequisites on the Dataverse instance:

- `DATAVERSE_FEATURE_API_SESSION_AUTH=1` (`dataverse.feature.api-session-auth`).
- `DATAVERSE_FEATURE_API_SESSION_AUTH_HARDENING=1` recommended in production. When set, every API call must include a valid same-origin `Origin`/`Referer` and the `X-Dataverse-CSRF-Token` header from `GET /api/users/:csrf-token`.
- `dataverse.siteUrl=<browser-facing URL>`. This is checked against `Origin`/`Referer`.

In each component's `index.tsx`:

```ts
import { ApiConfig } from '@iqss/dataverse-client-javascript'

ApiConfig.init(`${config.siteUrl}/api/v1`, DataverseApiAuthMechanism.SESSION_COOKIE)
```

Don't accept `apiKey` or `apiToken` as a config field. If you find yourself wanting to, the host is mis-configured — fix the host instead.

## CSS isolation

Bundled CSS is injected into `<head>` by `vite-plugin-css-injected-by-js`. To avoid bleeding into the host JSF page:

1. Wrap the React render in a scoped root element: `<div className="dv-<component>-root">`.
2. Keep all bundled CSS scoped to that class. Avoid `html`, `body`, or unscoped element selectors.
3. Use **CSS Modules** for design-system styles (hashed class names cannot collide with PrimeFaces or Bootstrap 3).
4. Page-level styling (background, fonts, viewport-fill) lives in a `standalone-page.scss` that is **only** loaded by the standalone demo HTML — not by the JSF-loaded bundle.

**Known caveat — Bootstrap 5 vs 3.** The shared chunk imports `bootstrap/dist/css/bootstrap.min.css` (5.x) for react-bootstrap. Dataverse JSF pages already load Bootstrap 3.x. On selectors that exist in both versions (`.btn`, `.form-control`, the grid system) the later-loaded sheet wins. The reusable component is fine because it loads after JSF, but JSF panels rendered alongside it can pick up Bootstrap-5 rules on those selectors. PrimeFaces (`ui-*`), Glyphicon, and Dataverse-internal classes are unaffected.

Picking one of these before unflagging a feature in production:

- A PostCSS scope-prefix plugin that wraps every bundled CSS rule under `.dv-<component>-root`.
- A Shadow DOM mount that keeps injected `<style>` tags inside the shadow boundary.

## Adding a new reusable component

Greenfield component (no existing SPA section to reuse):

1. **Design the contract first.** What does the host pass in? What events does the host need? Write the `config.ts` interface before writing any UI.
2. **Build the SPA section first.** Put the React tree under `src/sections/<area>/<feature>/`. Use the standard DDD layout (`src/<area>/domain/...`, `src/<area>/infrastructure/...`). It must run in the SPA before the JSF mount path is touched.
3. **Extract a `Core` component.** Pull the props-driven inner React tree out into `<Component>Core.tsx`. The SPA section keeps its routing/context glue; the core takes pure props.
4. **Add a standalone wrapper.** Create `src/standalone-<component>/index.tsx`, `config.ts`, `Standalone<Component>Repository.ts` (if needed). Wrap the core in a thin component that reads `window.<componentConfig>`, sets up `ApiConfig`, mounts on the configured div.
5. **Add a vite entry.** Append to `rollupOptions.input` in `vite.config.uploader.ts`.
6. **Add a demo HTML.** `src/standalone-<component>/<componentName>.html` with a one-page demo, including a snippet showing JSF integration.
7. **Document.** Update [Currently shipped components](#currently-shipped-components) and add a brief contract description.

## Making an existing SPA component reusable

Start by re-using an existing SPA section:

1. **Identify the smallest props-driven sub-tree.** Pull it out as `<Component>Core` if it isn't already. The core must not call `useNavigate`, `useSearchParams`, or any SPA-only hook. Move that to the wrapper.
2. **Externalise the repository.** Replace any `useRepository()` / shared-context hook with explicit props or a repository adapter.
3. **Replace router-driven side effects with callbacks.** `onSubmit` / `onCancel` / `onDownload` come from the standalone wrapper's `config`; the SPA wrapper provides router-driven defaults.
4. **Keep i18n.** Shared core uses `react-i18next` exactly as in the SPA; the standalone bundle initialises i18n from `config.locale`/`config.localesPath` (default `${siteUrl}/dvwebloader/locales/{{lng}}/{{ns}}.json`).
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
  localesPath?: string // default `${siteUrl}/dvwebloader/locales/{{lng}}/{{ns}}.json`
  rootElementId?: string // default 'dv-uploader'
  disableMD5Checksum?: boolean
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
<script type="module" src="/dvwebloader/reusable-components/dv-uploader.js"></script>
```

Feature flag (server-side): `dataverse.feature.react-uploader`.

### Tree view (`#6691`)

Built on the same pattern. The SPA section lives at `src/sections/dataset/dataset-files/files-tree/`; the standalone wrapper is in `src/standalone-tree-view/` and is the second entry point in `vite.config.uploader.ts` (`dv-tree-view`). The bundle config interface is `window.dvTreeViewConfig` (see [`src/standalone-tree-view/config.ts`](../src/standalone-tree-view/config.ts)).

Feature flag (server-side): `dataverse.feature.react-tree-view`.

The tree view ships:

- Lazy folder loading with an opaque keyset cursor.
- Path-keyed tri-state selection (folders without descendant enumeration; logical until download time).
- Visible-row virtualisation; no `react-virtual` / `react-window` dep.
- Full WAI-ARIA tree keyboard navigation (`ArrowUp/Down/Left/Right`, `Home/End`, `Space`, `Enter`).
- URL bookmarkability: `?view=tree&path=<folder>` round-trips and pre-fetches every ancestor on mount.
- **Client-side streaming-zip download.** Multi-file selections are zipped in the browser via [`client-zip`](https://github.com/Touffy/client-zip) (~3 KB gzip, the only new dep introduced by the tree). A bottom-sheet tray (`FilesTreeDownloadTray`) shows progress, the file currently being added, and surfaces an inline **Retry / Skip / Skip & retry at end / Skip all** decision row when a fetch fails. _Skip & retry at end_ converts the run into a two-pass flow mid-flight (failures accumulate as recoverable, then the tray prompts to retry them at the end). _Skip all_ switches to skip-with-manifest and writes a `manifest.txt` listing the failures into the root of the zip. Single-file downloads bypass the zip wrap and anchor-click `file.downloadUrl` directly. **No server contract changes.**

## Testing reusable components

- **SPA tests run as Cypress component tests** under `tests/component/...`, using `cy.customMount` so the React tree gets the same `Router`, `I18nextProvider`, `ThemeProvider`, and `ExternalToolsProvider` it would in production.
- **Standalone wrapper tests** mount the standalone component with a stubbed `window.<componentConfig>`. Verify the inline error path (config missing) explicitly — JSF callers cannot see thrown exceptions.
- **Unit-test transformers and config parsers** in plain TypeScript files under `tests/component/<component>/...spec.ts`. No Cypress for pure-TS code.
- **Storybook** stories may be added for components that benefit from visual review. Not required.
- **Coverage threshold** is 95% on `src/sections/**/*.{ts,tsx}` (`.nycrc.json`). Reusable components count.

When in doubt about a test, look at:

- `tests/component/sections/shared/file-uploader/FileUploaderPanelCore.spec.tsx`
- `tests/component/sections/dataset/dataset-files/files-tree/FilesTree.spec.tsx`

## Versioning and breaking changes

The reusable bundle is consumed cross-repo:

- The SPA and the standalone bundle move together (same git tag).
- Dataverse's `dvwebloader` directory is **served from the SPA build output**. There is no separate package version on the JSF side beyond the file path it loads.
- A breaking change to a config interface is a coordinated change across `dataverse-frontend` and `dataverse` (the JSF page that sets `window.<componentConfig>`).

Rules of thumb:

- **Add fields**, never remove. The host might be on an older JSF page.
- **Default to no-op** when a config field is unrecognised. Don't throw; log a `console.warn`.
- **Bump the file name (`dv-uploader.v2.js`) only on truly breaking changes** — a renamed config field, a removed mount path. Otherwise you fork the integration permanently.
- **Document the new shape in this file** and in the matching backend doc on the same PR. Reviewers should see both halves.
