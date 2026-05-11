/**
 * Standalone Tree View Configuration
 *
 * Set window.dvTreeViewConfig before loading the script:
 *
 *   <script>
 *     window.dvTreeViewConfig = {
 *       siteUrl:    'https://your-dataverse.edu',
 *       datasetPid: 'doi:10.5072/FK2/XXXXX',
 *       datasetVersionId: ':latest',  // or '1.0', etc.
 *       locale:     'en'              // optional, default 'en'
 *     }
 *   </script>
 *   <script type="module" src=".../reusable-components/dv-tree-view.js"></script>
 *   <div id="dv-tree-view"></div>
 *
 * Authentication is via the browser's JSESSIONID session cookie.
 * DATAVERSE_FEATURE_API_SESSION_AUTH must be enabled on the Dataverse
 * instance.
 */

export interface DvTreeViewConfig {
  /** Base URL of the Dataverse instance, e.g. https://demo.dataverse.org */
  siteUrl: string
  /** Persistent ID of the dataset whose files to list */
  datasetPid: string
  /**
   * Dataset version to list. Accepts ':latest', ':draft',
   * ':latest-published' or a specific version like '1.0'. Default
   * ':latest'.
   */
  datasetVersionId?: string
  /** Locale code for translations. Default: 'en' */
  locale?: string
  /**
   * URL template for translation files.
   * Default: `{siteUrl}/dvwebloader/locales/{{lng}}/{{ns}}.json`
   */
  localesPath?: string
  /** ID of the DOM element to mount into. Default: 'dv-tree-view' */
  rootElementId?: string
  /**
   * Path of the JSF file metadata page that filename links should
   * point at. The bundle appends `?fileId=<id>&version=<v>`. Default:
   * '/file.xhtml'.
   */
  fileMetadataPath?: string
}

declare global {
  interface Window {
    dvTreeViewConfig?: DvTreeViewConfig
  }
}
