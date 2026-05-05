import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import I18NextHttpBackend from 'i18next-http-backend'
import { ApiConfig, DataverseApiAuthMechanism } from '@iqss/dataverse-client-javascript'
import { ToastContainer } from 'react-toastify'
import { AccessRepositoryProvider } from '@/sections/access/AccessRepositoryProvider'
import { AccessJSDataverseRepository } from '@/access/infrastructure/repositories/AccessJSDataverseRepository'
import { FilesTree } from '@/sections/dataset/dataset-files/files-tree/FilesTree'
import { FileTreeJSDataverseRepository } from '@/files/infrastructure/repositories/FileTreeJSDataverseRepository'
import { DatasetVersion, DatasetVersionNumber } from '@/dataset/domain/models/Dataset'
import { FileTreeFile } from '@/files/domain/models/FileTreeItem'

import '../../packages/design-system/dist/style.css'
import 'bootstrap/dist/css/bootstrap.min.css'
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

async function init() {
  const config = window.dvTreeViewConfig
  const rootElementId = config?.rootElementId ?? 'dv-tree-view'
  const container = document.getElementById(rootElementId)
  if (!container) {
    console.error(`[dvTreeView] Mount element #${rootElementId} not found`)
    return
  }
  const root = createRoot(container)

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

  await i18next
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

  const mountConfig: MountConfig = {
    datasetPid: config.datasetPid,
    datasetVersionId: config.datasetVersionId ?? ':latest',
    fileMetadataPath: config.fileMetadataPath ?? '/file.xhtml'
  }
  const treeRepository = new FileTreeJSDataverseRepository()
  const accessRepository = new AccessJSDataverseRepository()
  const datasetVersion = syntheticVersion(mountConfig.datasetVersionId)
  const buildFileMetadataUrl = buildFileMetadataUrlFactory(mountConfig)

  root.render(
    <StrictMode>
      <div className="dv-tree-view-root">
        <ToastContainer position="top-right" autoClose={5000} />
        <AccessRepositoryProvider repository={accessRepository}>
          <FilesTree
            treeRepository={treeRepository}
            datasetPersistentId={mountConfig.datasetPid}
            datasetVersion={datasetVersion}
            buildFileMetadataUrl={buildFileMetadataUrl}
          />
        </AccessRepositoryProvider>
      </div>
    </StrictMode>
  )
}

init().catch((error) => {
  console.error('[dvTreeView] init failed:', error)
})
