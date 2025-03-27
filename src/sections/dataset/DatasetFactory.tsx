import { ReactElement, useEffect, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetContext } from './DatasetContext'
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
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'

const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const contactRepository = new ContactJSDataverseRepository()
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
  const tab = searchParams.get('tab') ?? undefined
  const version = searchParamVersionToDomainVersion(searchParamVersion)
  const location = useLocation()
  const state = location.state as
    | { created: boolean; metadataUpdated: boolean; publishInProgress: boolean }
    | undefined
  const created = state?.created ?? false
  const publishInProgress = state?.publishInProgress ?? false
  const metadataUpdated = state?.metadataUpdated ?? false
  const datasetContext = useContext(DatasetContext)

  useEffect(() => {
    if (privateUrlToken) setAnonymizedView(true)
  }, [privateUrlToken, setAnonymizedView])

  useEffect(() => {
    if (datasetContext?.refreshDataset) {
      datasetContext.refreshDataset()
    }
  }, [version, datasetContext])

  if (privateUrlToken) {
    return (
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ privateUrlToken: privateUrlToken }}
        isPublishing={publishInProgress}>
        <Dataset
          collectionRepository={collectionRepository}
          datasetRepository={datasetRepository}
          fileRepository={fileRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          contactRepository={contactRepository}
          filesTabInfiniteScrollEnabled={FILES_TAB_INFINITE_SCROLL_ENABLED}
          tab={tab}
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
        collectionRepository={collectionRepository}
        datasetRepository={datasetRepository}
        fileRepository={fileRepository}
        metadataBlockInfoRepository={metadataBlockInfoRepository}
        contactRepository={contactRepository}
        created={created}
        publishInProgress={publishInProgress}
        metadataUpdated={metadataUpdated}
        filesTabInfiniteScrollEnabled={FILES_TAB_INFINITE_SCROLL_ENABLED}
        tab={tab}
      />
    </DatasetProvider>
  )
}
