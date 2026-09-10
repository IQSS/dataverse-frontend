/**
 * Standalone Uploader Configuration
 *
 * Set window.dvUploaderConfig before loading the script:
 *
 *   <script>
 *     window.dvUploaderConfig = {
 *       siteUrl:     'https://your-dataverse.edu',
 *       datasetPid:  'doi:10.5072/FK2/XXXXX',
 *       bearerToken: '...',       // optional — see Authentication below
 *       locale:      'en'         // optional, default 'en'
 *     }
 *   </script>
 *   <script type="module" src=".../reusable-components/dv-uploader.js"></script>
 *   <div id="dv-uploader"></div>
 *
 * Authentication. Two contracts, host picks one:
 *   1. Pass `bearerToken` (or `getBearerToken`) — used as
 *      `Authorization: Bearer <token>` on every API request. Works
 *      from any origin and any host page. How the host obtains the
 *      token (OIDC flow, server-side render, token-exchange, …) is
 *      out of scope of this bundle.
 *   2. Omit both — the SDK falls back to sending the browser's
 *      JSESSIONID cookie via `withCredentials: true`. This is the
 *      shortcut for same-origin JSF embeddings where the user is
 *      already logged in and `DATAVERSE_FEATURE_API_SESSION_AUTH=1`
 *      is enabled on the Dataverse instance.
 */

export interface DvUploaderConfig {
  /** Base URL of the Dataverse instance, e.g. https://demo.dataverse.org */
  siteUrl: string
  /** Persistent ID of the dataset to upload files into */
  datasetPid: string
  /**
   * Bearer token sent as `Authorization: Bearer <token>` on every API
   * request. Use this from any host page where you can produce a token
   * (cross-origin embed, non-JSF host, …). If you also pass
   * `getBearerToken`, the function takes precedence and is consulted on
   * every request — that's the right shape when the token needs to
   * refresh during the bundle's lifetime.
   */
  bearerToken?: string
  /**
   * Per-request bearer-token getter. Consulted on every API call, so
   * returning a freshly-refreshed token transparently rotates auth
   * without remounting the bundle. Return `null`/`undefined` to fall
   * through to the static `bearerToken`. Note: providing either bearer
   * option locks the bundle to bearer auth at mount time — there is no
   * per-request fallthrough to session-cookie auth; that mode applies
   * only when BOTH options are omitted.
   */
  getBearerToken?: () => string | null | undefined
  /** Locale code for translations. Default: 'en' */
  locale?: string
  /**
   * URL template for translation files. Defaults to `locales/{{lng}}/{{ns}}.json`
   * resolved against this bundle's own URL, which is correct wherever the
   * bundle is deployed. Set it only when the translations are served from
   * somewhere other than next to the bundle.
   */
  localesPath?: string
  /** ID of the DOM element to mount into. Default: 'dv-uploader' */
  rootElementId?: string
  /** Skip MD5 checksum calculation. Default: false */
  disableMD5Checksum?: boolean
}

declare global {
  interface Window {
    dvUploaderConfig?: DvUploaderConfig
  }
}
