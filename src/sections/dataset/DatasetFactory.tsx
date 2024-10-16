import { ReactElement, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useAnonymized } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { SettingJSDataverseRepository } from '../../settings/infrastructure/SettingJSDataverseRepository'
import { SettingsProvider } from '../settings/SettingsProvider'
import { DatasetProvider } from './DatasetProvider'
import { MultipleFileDownloadProvider } from '../file/multiple-file-download/MultipleFileDownloadProvider'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { AlertProvider } from '../alerts/AlertProvider'
import { searchParamVersionToDomainVersion } from '../../router'
import { FILES_TAB_INFINITE_SCROLL_ENABLED } from './config'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()

const settingRepository = new SettingJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return (
      <MultipleFileDownloadProvider repository={fileRepository}>
        <SettingsProvider repository={settingRepository}>
          <NotImplementedModalProvider>
            <AnonymizedProvider>
              <AlertProvider>
                <DatasetWithSearchParams />
              </AlertProvider>
            </AnonymizedProvider>
          </NotImplementedModalProvider>
        </SettingsProvider>
      </MultipleFileDownloadProvider>
    )
  }
}

function DatasetWithSearchParams() {
  const { setAnonymizedView } = useAnonymized()
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId') ?? undefined
  const privateUrlToken = searchParams.get('privateUrlToken')
  const searchParamVersion = searchParams.get('version') ?? undefined
  const version = searchParamVersionToDomainVersion(searchParamVersion)
  const location = useLocation()
  const state = location.state as
    | { created: boolean; metadataUpdated: boolean; publishInProgress: boolean }
    | undefined
  const created = state?.created ?? false
  const publishInProgress = state?.publishInProgress ?? false
  const metadataUpdated = state?.metadataUpdated ?? false

  useEffect(() => {
    if (privateUrlToken) setAnonymizedView(true)
  }, [privateUrlToken, setAnonymizedView])

  if (privateUrlToken) {
    return (
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ privateUrlToken: privateUrlToken }}
        isPublishing={publishInProgress}>
        <Dataset
          datasetRepository={datasetRepository}
          fileRepository={fileRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          filesTabInfiniteScrollEnabled={FILES_TAB_INFINITE_SCROLL_ENABLED}
        />
      </DatasetProvider>
    )
  }

  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version }}
      isPublishing={publishInProgress}>
      <Dataset
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        created={created}
        publishInProgress={publishInProgress}
        metadataUpdated={metadataUpdated}
        filesTabInfiniteScrollEnabled={FILES_TAB_INFINITE_SCROLL_ENABLED}
      />
    </DatasetProvider>
  )
}
