import { ReactElement, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dataset } from './Dataset'
import { DatasetJSDataverseRepository } from '../../dataset/infrastructure/repositories/DatasetJSDataverseRepository'
import { useAnonymized } from './anonymized/AnonymizedContext'
import { AnonymizedProvider } from './anonymized/AnonymizedProvider'
import { FileJSDataverseRepository } from '../../files/infrastructure/FileJSDataverseRepository'
import { MetadataBlockInfoProvider } from './metadata-block-info/MetadataBlockProvider'
import { MetadataBlockInfoJSDataverseRepository } from '../../metadata-block-info/infrastructure/repositories/MetadataBlockInfoJSDataverseRepository'
import { SettingJSDataverseRepository } from '../../settings/infrastructure/SettingJSDataverseRepository'
import { FilePermissionsProvider } from '../file/file-permissions/FilePermissionsProvider'
import { SettingsProvider } from '../settings/SettingsProvider'
import { DatasetProvider } from './DatasetProvider'
import { NotImplementedModalProvider } from '../not-implemented/NotImplementedModalProvider'
import { AlertProvider } from '../alerts/AlertProvider'

const datasetRepository = new DatasetJSDataverseRepository()
const fileRepository = new FileJSDataverseRepository()
const metadataBlockInfoRepository = new MetadataBlockInfoJSDataverseRepository()
const settingRepository = new SettingJSDataverseRepository()

export class DatasetFactory {
  static create(): ReactElement {
    return (
      <FilePermissionsProvider repository={fileRepository}>
        <SettingsProvider repository={settingRepository}>
          <NotImplementedModalProvider>
            <MetadataBlockInfoProvider repository={metadataBlockInfoRepository}>
              <AnonymizedProvider>
                <AlertProvider>
                  <DatasetWithSearchParams />
                </AlertProvider>
              </AnonymizedProvider>
            </MetadataBlockInfoProvider>
          </NotImplementedModalProvider>
        </SettingsProvider>
      </FilePermissionsProvider>
    )
  }
}

function DatasetWithSearchParams() {
  const { setAnonymizedView } = useAnonymized()
  const [searchParams] = useSearchParams()
  const persistentId = searchParams.get('persistentId') ?? undefined
  const privateUrlToken = searchParams.get('privateUrlToken')
  const version = searchParams.get('version') ?? undefined

  useEffect(() => {
    if (privateUrlToken) setAnonymizedView(true)
  }, [privateUrlToken])

  if (privateUrlToken) {
    return (
      <DatasetProvider
        repository={datasetRepository}
        searchParams={{ privateUrlToken: privateUrlToken }}>
        <Dataset fileRepository={fileRepository} />
      </DatasetProvider>
    )
  }

  return (
    <DatasetProvider
      repository={datasetRepository}
      searchParams={{ persistentId: persistentId, version: version }}>
      <Dataset fileRepository={fileRepository} />
    </DatasetProvider>
  )
}
