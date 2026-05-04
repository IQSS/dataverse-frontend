/**
 * Standalone Uploader Configuration
 *
 * Set window.dvUploaderConfig before loading the script:
 *
 *   <script>
 *     window.dvUploaderConfig = {
 *       siteUrl:    'https://your-dataverse.edu',
 *       datasetPid: 'doi:10.5072/FK2/XXXXX',
 *       locale:     'en'          // optional, default 'en'
 *     }
 *   </script>
 *   <script type="module" src=".../dvwebloader/reusable-components/dv-uploader.js"></script>
 *   <div id="dv-uploader"></div>
 *
 * Authentication is via the browser's JSESSIONID session cookie.
 * DATAVERSE_FEATURE_API_SESSION_AUTH must be enabled on the Dataverse instance.
 */

export interface DvUploaderConfig {
  /** Base URL of the Dataverse instance, e.g. https://demo.dataverse.org */
  siteUrl: string
  /** Persistent ID of the dataset to upload files into */
  datasetPid: string
  /** Locale code for translations. Default: 'en' */
  locale?: string
  /**
   * URL template for translation files.
   * Default: `{siteUrl}/dvwebloader/locales/{{lng}}/{{ns}}.json`
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
