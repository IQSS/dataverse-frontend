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
import { DataverseInfoJSDataverseRepository } from '@/info/infrastructure/repositories/DataverseInfoJSDataverseRepository'
import { SettingsProvider } from '../settings/SettingsProvider'
import { DatasetProvider } from './DatasetProvider'
import { MultipleFileDownloadProvider } from '../file/multiple-file-download/MultipleFileDownloadProvider'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { AlertProvider } from '../alerts/AlertProvider'
import { searchParamVersionToDomainVersion } from '../../router'
import { FILES_TAB_INFINITE_SCROLL_ENABLED } from './config'
import { CollectionJSDataverseRepository } from '@/collection/infrastructure/repositories/CollectionJSDataverseRepository'
import { ContactJSDataverseRepository } from '@/contact/infrastructure/ContactJSDataverseRepository'
import { AccessJSDataverseRepository } from '@/access/infrastructure/repositories/AccessJSDataverseRepository'
import { AccessRepositoryProvider } from '../access/AccessRepositoryProvider'
import { GuestbookJSDataverseRepository } from '@/guestbooks/infrastructure/repositories/GuestbookJSDataverseRepository'
import { GuestbookRepositoryProvider } from '../guestbooks/GuestbookRepositoryProvider'
import { RepositoriesProvider } from '@/shared/contexts/repositories/RepositoriesProvider'

const collectionRepository = new CollectionJSDataverseRepository()
const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const contactRepository = new ContactJSDataverseRepository()
const dataverseInfoRepository = new DataverseInfoJSDataverseRepository()
const accessRepository = new AccessJSDataverseRepository()
const guestbookRepository = new GuestbookJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return (
      <GuestbookRepositoryProvider repository={guestbookRepository}>
        <AccessRepositoryProvider repository={accessRepository}>
          <MultipleFileDownloadProvider repository={fileRepository}>
            <SettingsProvider dataverseInfoRepository={dataverseInfoRepository}>
              <NotImplementedModalProvider>
                <AnonymizedProvider>
                  <AlertProvider>
                    <DatasetWithSearchParams />
                  </AlertProvider>
                </AnonymizedProvider>
              </NotImplementedModalProvider>
            </SettingsProvider>
          </MultipleFileDownloadProvider>
        </AccessRepositoryProvider>
      </GuestbookRepositoryProvider>
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
  const state = location.state as { publishInProgress: boolean } | undefined
  const publishInProgress = state?.publishInProgress ?? false
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
      <RepositoriesProvider collectionRepository={collectionRepository}>
        <DatasetProvider
          repository={datasetRepository}
          searchParams={{ privateUrlToken: privateUrlToken }}
          isPublishing={publishInProgress}>
          <Dataset
            datasetRepository={datasetRepository}
            fileRepository={fileRepository}
            metadataBlockInfoRepository={metadataBlockInfoRepository}
            contactRepository={contactRepository}
            filesTabInfiniteScrollEnabled={FILES_TAB_INFINITE_SCROLL_ENABLED}
            tab={tab}
            dataverseInfoRepository={dataverseInfoRepository}
          />
        </DatasetProvider>
      </RepositoriesProvider>
    )
  }

  return (
    <RepositoriesProvider collectionRepository={collectionRepository}>
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ persistentId: persistentId, version: version }}
        isPublishing={publishInProgress}>
        <Dataset
          datasetRepository={datasetRepository}
          fileRepository={fileRepository}
          metadataBlockInfoRepository={metadataBlockInfoRepository}
          contactRepository={contactRepository}
          publishInProgress={publishInProgress}
          filesTabInfiniteScrollEnabled={FILES_TAB_INFINITE_SCROLL_ENABLED}
          tab={tab}
          dataverseInfoRepository={dataverseInfoRepository}
        />
      </DatasetProvider>
    </RepositoriesProvider>
  )
}
